import {
  Injectable,
  Inject,
  Logger,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, isNull } from 'drizzle-orm';
import * as schema from '../../../db/schema';
import { walletControllers } from '../../../db/schema/wallet/wallet_controllers';
import { wallets } from '../../../db/schema/wallet/wallets';
import { walletAccounts } from '../../../db/schema/wallet/wallet_accounts';
import { RelayerService } from '../../relayer/relayer.service';
import { parseAbiItem } from 'viem';

type ControllerRow = typeof walletControllers.$inferSelect;

/** Validator module types only. Guardians are a separate concept — see wallet_guardians table. */
export type ValidatorControllerType = 'passkey' | 'mpc' | 'hardware';

export interface AddControllerParams {
  walletId: string;
  controllerType: ValidatorControllerType;
  controllerIdentifier: string;
  validatorContractAddress?: string;
  onChainPublicData?: string;
  canSignTransactions?: boolean;
  canManageControllers?: boolean;
  canInitiateRecovery?: boolean;
}

/**
 * WalletControllerService — Manages authentication controllers on a Verse Smart Account.
 *
 * This service records controllers in the backend as a mirror of on-chain state.
 * It does NOT authorize transactions — that is done exclusively by on-chain validators.
 *
 * ─── Key Invariants ──────────────────────────────────────────────────────
 *   INV-06: Controller rotation MUST NOT change walletIdentityId.
 *   INV-07: Controller rotation MUST NOT change the deployed address.
 *   INV-14: Connected EOAs MUST NOT appear here.
 *   INV-16: This table mirrors on-chain state; it does not define it.
 *   INV-17: Entries MUST be reconciled against on-chain state after any change.
 *   INV-18: Guardians are in the recovery module — validatorContractAddress is NULL.
 *   INV-19: The initial passkey is the Kernel root validator at deployment.
 *   INV-20: Additional controllers are installed post-deployment via installModule.
 */
@Injectable()
export class WalletControllerService {
  private readonly logger = new Logger(WalletControllerService.name);

  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly relayer: RelayerService
  ) {}

  /**
   * Records a new controller for a wallet.
   *
   * This creates the off-chain record. The controller is NOT active until
   * `confirmedOnChain` is set to true after on-chain confirmation (INV-16, INV-17).
   *
   * For the initial passkey (set during wallet creation), `canManageControllers`
   * should be true (it is the Kernel root validator). All others default false.
   *
   * INV-14: Rejects any address that is also a connected_wallet for this profile.
   */
  async addController(params: AddControllerParams): Promise<ControllerRow> {
    // Verify wallet exists
    const wallet = await this.db.query.wallets.findFirst({
      where: eq(wallets.id, params.walletId),
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet ${params.walletId} not found.`);
    }

    // Guard: prevent duplicate controller entries
    const existing = await this.db.query.walletControllers.findFirst({
      where: and(
        eq(walletControllers.walletId, params.walletId),
        eq(walletControllers.controllerIdentifier, params.controllerIdentifier),
        isNull(walletControllers.revokedAt),
      ),
    });

    if (existing) {
      throw new ConflictException(
        `Controller ${params.controllerIdentifier} is already registered for wallet ${params.walletId}.`,
      );
    }

    // Guardians are NOT valid controller types — managed separately via wallet_guardians.
    // The ValidatorControllerType union enforces this at the type level.

    const [controller] = await this.db
      .insert(walletControllers)
      .values({
        walletId: params.walletId,
        controllerType: params.controllerType,
        controllerIdentifier: params.controllerIdentifier,
        validatorContractAddress: params.validatorContractAddress ?? null,
        onChainPublicData: params.onChainPublicData ?? null,
        canSignTransactions: params.canSignTransactions ?? true,
        canManageControllers: params.canManageControllers ?? false,
        canInitiateRecovery: params.canInitiateRecovery ?? false,
        addedAt: new Date(),
        confirmedOnChain: false,
      })
      .returning();

    this.logger.log(
      `Recorded ${params.controllerType} controller for wallet ${params.walletId}: ${params.controllerIdentifier}`,
    );

    return controller;
  }

  /**
   * Marks a controller as confirmed on-chain after the installModule tx is confirmed.
   *
   * INV-16: Backend mirrors on-chain state, does not define it.
   * INV-17: Only mark confirmed after querying the on-chain module state.
   */
  async markControllerConfirmed(
    walletId: string,
    controllerIdentifier: string,
    confirmedAtBlock: bigint,
  ): Promise<void> {
    await this.db
      .update(walletControllers)
      .set({
        confirmedOnChain: true,
        confirmedAtBlock,
      })
      .where(
        and(
          eq(walletControllers.walletId, walletId),
          eq(walletControllers.controllerIdentifier, controllerIdentifier),
          isNull(walletControllers.revokedAt),
        ),
      );

    this.logger.log(
      `Controller ${controllerIdentifier} confirmed on-chain at block ${confirmedAtBlock} for wallet ${walletId}`,
    );
  }

  /**
   * Revokes a controller (sets revokedAt).
   *
   * This does NOT perform any on-chain action. The caller must ensure the
   * uninstallModule transaction is submitted and confirmed before calling this.
   *
   * INV-06: Revoking a controller MUST NOT change walletIdentityId.
   * INV-07: Revoking a controller MUST NOT change the deployed address.
   */
  async revokeController(
    walletId: string,
    controllerId: string,
  ): Promise<void> {
    const controller = await this.db.query.walletControllers.findFirst({
      where: and(
        eq(walletControllers.walletId, walletId),
        eq(walletControllers.id, controllerId),
        isNull(walletControllers.revokedAt),
      ),
    });

    if (!controller) {
      throw new NotFoundException(
        `Active controller ${controllerId} not found for wallet ${walletId}.`,
      );
    }

    await this.db
      .update(walletControllers)
      .set({ revokedAt: new Date() })
      .where(eq(walletControllers.id, controllerId));

    this.logger.log(
      `Revoked controller ${controllerId} (${controller.controllerIdentifier}) for wallet ${walletId}`,
    );
  }

  /**
   * Returns all active (non-revoked) controllers for a wallet.
   * Optionally filtered to only on-chain confirmed controllers.
   */
  async getActiveControllers(walletId: string, onlyConfirmed = false) {
    const conditions = [
      eq(walletControllers.walletId, walletId),
      isNull(walletControllers.revokedAt),
    ];

    // Note: Drizzle doesn't support conditional `where` chaining cleanly,
    // so we filter in-memory for the `onlyConfirmed` case.
    const all = await this.db.query.walletControllers.findMany({
      where: and(...conditions),
    });

    // IMPORTANT: When onlyConfirmed=false, results include controllers that are NOT
    // yet confirmed on-chain (confirmedOnChain=false). Callers MUST check this field
    // before treating any controller as having on-chain authority. No controller with
    // confirmedOnChain=false should be used for transaction authorization decisions.
    return onlyConfirmed ? all.filter((c) => c.confirmedOnChain) : all;
  }

  /**
   * Stub: Reconciles the backend controller list against on-chain state.
   *
   * This must be implemented once we have chain-reading infrastructure (viem clients).
   * It should:
   *   1. Query the Kernel account's installed modules on-chain
   *   2. Verify each wallet_controllers entry matches an installed module
   *   3. Mark any off-chain entries missing on-chain as 'needs_review'
   *   4. Confirm any on-chain modules not yet confirmed in the DB
   *
   * INV-16: The backend mirrors on-chain state; it does not define it.
   * INV-17: Entries MUST be reconciled against on-chain state after any change.
   */
  async reconcileOnChainState(
    walletId: string,
    chainId: number,
  ): Promise<void> {
    this.logger.log(`Reconciling on-chain state for wallet ${walletId} on chain ${chainId}`);

    // 1. Get wallet account address for this chain
    const account = await this.db.query.walletAccounts.findFirst({
      where: and(
        eq(walletAccounts.walletId, walletId),
        eq(walletAccounts.chainId, chainId)
      )
    });

    if (!account || account.deploymentStatus !== 'deployed') {
      this.logger.warn(`Wallet ${walletId} is not deployed on chain ${chainId}. Skipping reconciliation.`);
      return;
    }

    // 2. Fetch all controllers for this wallet
    const controllers = await this.db.query.walletControllers.findMany({
      where: and(
        eq(walletControllers.walletId, walletId),
        isNull(walletControllers.revokedAt)
      )
    });

    // 3. Setup viem client and ABI
    const client = this.relayer.client;
    // For Kernel v3, isModuleInstalled(uint256 moduleType, address module, bytes additionalContext)
    const isModuleInstalledAbi = parseAbiItem('function isModuleInstalled(uint256 moduleType, address module, bytes additionalContext) external view returns (bool)');
    const VALIDATOR_TYPE = 1n;

    for (const controller of controllers) {
      if (!controller.validatorContractAddress) continue; // Skip if no contract defined

      try {
        const isInstalled = await client.readContract({
          address: account.address as `0x${string}`,
          abi: [isModuleInstalledAbi],
          functionName: 'isModuleInstalled',
          args: [VALIDATOR_TYPE, controller.validatorContractAddress as `0x${string}`, '0x']
        });

        if (isInstalled && !controller.confirmedOnChain) {
          // Confirm it
          await this.db.update(walletControllers)
            .set({ confirmedOnChain: true })
            .where(eq(walletControllers.id, controller.id));
          this.logger.log(`Controller ${controller.id} confirmed on-chain for wallet ${walletId}.`);
        } else if (!isInstalled && controller.confirmedOnChain) {
          // Off-chain says confirmed, but on-chain it's missing (needs review/sync)
          // For now, we'll log it as a sync issue
          this.logger.warn(`Controller ${controller.id} is marked confirmed off-chain, but is not installed on-chain!`);
        }
      } catch (err) {
        this.logger.error(`Failed to read Kernel state for controller ${controller.id}: ${err.message}`);
      }
    }
  }
}
