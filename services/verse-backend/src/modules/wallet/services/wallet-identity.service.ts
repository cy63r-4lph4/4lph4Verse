import {
  Injectable,
  Inject,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, isNull } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import * as schema from '../../../db/schema';
import { wallets } from '../../../db/schema/wallet/wallets';
import { walletAccounts } from '../../../db/schema/wallet/wallet_accounts';
import { walletControllers } from '../../../db/schema/wallet/wallet_controllers';
import {
  computeWalletAddress,
  deriveWalletIdentityId,
} from '../../../shared/wallet/derivation';
import { ChainConfigService } from './chain-config.service';

/**
 * WalletIdentityService — Core service for the Verse Wallet identity layer.
 *
 * Implements the exact derivation model from Architecture v6 §4–§6:
 *
 *   walletIdentityId = keccak256("verse.wallet.identity.v1" || walletIdentitySeed)
 *   verseInputSalt   = keccak256(domain || version || walletIdentityId || accountIndex)
 *   actualSalt       = keccak256(initCalldata || verseInputSalt)          [KernelFactory line 25]
 *   address          = CREATE2(factory, actualSalt, keccak256(proxyBytecode))
 *
 * ─── Critical Invariants ─────────────────────────────────────────────────
 *   INV-01: walletIdentityId is immutable after creation.
 *   INV-04: walletIdentitySeed MUST NEVER be stored by the backend.
 *   INV-07: Controller rotation MUST NOT change the deployed address.
 *   INV-22: derivationInitController is recorded at deployment and never changed.
 *   INV-23: Address stability means: stable AFTER deployment.
 *   INV-24: walletIdentityId is independent of any controller identifier.
 */
@Injectable()
export class WalletIdentityService {
  private readonly logger = new Logger(WalletIdentityService.name);

  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly chainConfig: ChainConfigService,
  ) {}

  /**
   * Creates a new Verse Wallet identity for a given Verse Profile.
   *
   * Steps:
   *   1. Generate 32-byte secure random seed (in-memory only — NEVER persisted)
   *   2. Derive walletIdentityId = keccak256("verse.wallet.identity.v1" || seed)
   *   3. Insert into `wallets` table
   *
   * The seed is derived using Node.js `crypto.randomBytes` and is immediately
   * discarded. The walletIdentityId is the only persistent artifact.
   *
   * The seed exists only to derive walletIdentityId. It is generated, hashed,
   * and immediately zeroed. No external system receives it.
   *
   * INV-04: walletIdentitySeed MUST NEVER be stored by the backend.
   */
  async createWalletIdentity(verseProfileId: string): Promise<{
    id: string;
    walletIdentityId: string;
    verseProfileId: string;
    derivationVersion: number;
  }> {
    // Guard: prevent duplicate wallet creation for the same profile
    const existing = await this.db.query.wallets.findFirst({
      where: eq(wallets.verseProfileId, verseProfileId),
    });

    if (existing) {
      this.logger.warn(
        `Wallet already exists for profile ${verseProfileId}: ${existing.walletIdentityId}`,
      );
      return existing;
    }

    // 1. Generate seed — 32 bytes of cryptographically secure random data
    //    INV-04: This seed is used only to derive walletIdentityId and is
    //    immediately discarded. It MUST NOT be logged or stored.
    const walletIdentitySeed = randomBytes(32);

    // 2. Derive walletIdentityId
    //    walletIdentityId = keccak256("verse.wallet.identity.v1" || seed)
    const walletIdentityId = deriveWalletIdentityId(walletIdentitySeed);

    // Immediately zero out the seed buffer — defense in depth
    walletIdentitySeed.fill(0);

    // 3. Persist only the walletIdentityId (seed is gone)
    const [newWallet] = await this.db
      .insert(wallets)
      .values({
        verseProfileId,
        walletIdentityId,
        derivationVersion: 1,
      })
      .returning();

    this.logger.log(
      `Created wallet identity for profile ${verseProfileId}: ${walletIdentityId}`,
    );

    return newWallet;
  }

  /**
   * Computes and stores the counterfactual address for a wallet on a specific chain.
   *
   * Requires:
   *   - The wallet identity (walletIdentityId) to be already created
   *   - The chain's contract addresses to be configured (ChainConfigService)
   *   - The initial passkey's P-256 public key (x, y) — collected during passkey registration
   *
   * INV-21: actualSalt = keccak256(initCalldata || verseInputSalt)
   * INV-22: derivationInitController is recorded and must not change.
   * INV-23: Status starts as 'predicted'. Becomes 'deployed' after first UserOp.
   * INV-25: Address depends on walletIdentityId + initial passkey key.
   */
  async computeAndStoreAddress(params: {
    walletId: string;
    chainId: number;
    initialPasskeyX: bigint;
    initialPasskeyY: bigint;
    passkeyCredentialId: string; // stored as derivationInitController (INV-22)
  }): Promise<{
    address: string;
    deploymentStatus: string;
    chainId: number;
    isAddressParity: boolean;
  }> {
    // Check for existing account on this chain
    const existing = await this.db.query.walletAccounts.findFirst({
      where: and(
        eq(walletAccounts.walletId, params.walletId),
        eq(walletAccounts.chainId, params.chainId),
      ),
    });

    if (existing) {
      this.logger.warn(
        `Account already exists for wallet ${params.walletId} on chain ${params.chainId}`,
      );
      return existing;
    }

    // Fetch the wallet identity
    const wallet = await this.db.query.wallets.findFirst({
      where: eq(wallets.id, params.walletId),
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet ${params.walletId} not found.`);
    }

    // Fetch the chain derivation config
    const chainConf = await this.chainConfig.getDerivationConfig(
      params.chainId,
    );

    // ⚠️ UNVERIFIED: Proxy bytecode is a placeholder. The address computed here
    // is not confirmed to match any on-chain deployment until testnet verification
    // on Base Sepolia confirms computed address == on-chain address exactly.
    const address = computeWalletAddress({
      walletIdentityId: wallet.walletIdentityId as `0x${string}`,
      accountIndex: 0, // primary account
      initialPasskeyX: params.initialPasskeyX,
      initialPasskeyY: params.initialPasskeyY,
      passkeyValidatorAddress: chainConf.passkeyValidatorAddress,
      kernelFactoryAddress: chainConf.kernelFactoryAddress,
      kernelImplAddress: chainConf.kernelImplAddress,
    });

    // Persist the account record
    const [newAccount] = await this.db
      .insert(walletAccounts)
      .values({
        walletId: params.walletId,
        chainId: params.chainId,
        address,
        deploymentStatus: 'predicted',
        isAddressParity: true, // Assumed true; verified by parity check job (TODO)
        derivationInitController: params.passkeyCredentialId,
        kernelFactoryAddress: chainConf.kernelFactoryAddress,
        kernelImplAddress: chainConf.kernelImplAddress,
        passkeyValidatorAddress: chainConf.passkeyValidatorAddress,
        entryPointAddress: chainConf.entryPointAddress,
      })
      .returning();

    this.logger.log(
      `Computed address ${address} for wallet ${params.walletId} on chain ${params.chainId}`,
    );

    return newAccount;
  }

  /**
   * Fetches the full wallet record including accounts and controllers for a profile.
   */
  async getWalletForProfile(verseProfileId: string) {
    const wallet = await this.db.query.wallets.findFirst({
      where: eq(wallets.verseProfileId, verseProfileId),
      with: {
        // IMPORTANT: Accounts include 'predicted' status rows. Callers MUST check
        // account.deploymentStatus before treating any address as authoritative
        // or fund-receivable. Only 'deployed' accounts have confirmed on-chain existence.
        accounts: true,
        // IMPORTANT: Results include controllers with confirmedOnChain=false.
        // Callers MUST check confirmedOnChain before treating as authoritative.
        controllers: {
          where: isNull(walletControllers.revokedAt),
        },
      },
    });

    if (!wallet) {
      return null;
    }

    return wallet;
  }

  /**
   * Marks a wallet account as deployed after observing the on-chain confirmation.
   *
   * Called by the event listener / webhook when a UserOperation with initCode
   * is confirmed on-chain. The address MUST match the predicted address — if it
   * does not, this is a critical invariant violation (INV-07).
   */
  async markDeployed(params: {
    walletId: string;
    chainId: number;
    confirmedAddress: string;
    deployedAtBlock: bigint;
  }): Promise<void> {
    const account = await this.db.query.walletAccounts.findFirst({
      where: and(
        eq(walletAccounts.walletId, params.walletId),
        eq(walletAccounts.chainId, params.chainId),
      ),
    });

    if (!account) {
      throw new NotFoundException(
        `No predicted account found for wallet ${params.walletId} on chain ${params.chainId}`,
      );
    }

    // INV-07 enforcement: confirmed address MUST match the predicted address
    if (
      account.address.toLowerCase() !== params.confirmedAddress.toLowerCase()
    ) {
      this.logger.error(
        `CRITICAL INVARIANT VIOLATION (INV-07): ` +
          `Predicted address ${account.address} does not match confirmed address ` +
          `${params.confirmedAddress} for wallet ${params.walletId} on chain ${params.chainId}`,
      );
      throw new Error(
        `Address mismatch on deployment: predicted=${account.address}, confirmed=${params.confirmedAddress}`,
      );
    }

    await this.db
      .update(walletAccounts)
      .set({
        deploymentStatus: 'deployed',
        deployedAt: new Date(),
        deployedAtBlock: params.deployedAtBlock,
      })
      .where(
        and(
          eq(walletAccounts.walletId, params.walletId),
          eq(walletAccounts.chainId, params.chainId),
        ),
      );

    this.logger.log(
      `Wallet ${params.walletId} marked deployed on chain ${params.chainId} at block ${params.deployedAtBlock}`,
    );
  }
}
