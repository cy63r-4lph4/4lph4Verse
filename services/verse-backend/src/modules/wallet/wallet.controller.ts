import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { WalletIdentityService } from './services/wallet-identity.service';
import { WalletControllerService } from './services/wallet-controller.service';
import { ConnectedWalletService } from './services/connected-wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { ComputeAddressDto } from './dto/compute-address.dto';
import { AddControllerDto } from './dto/add-controller.dto';
import { LinkEOADto } from './dto/link-eoa.dto';

/**
 * WalletController — REST API for the Verse Wallet Infrastructure.
 *
 * Provides endpoints for:
 *   - Creating a wallet identity (walletIdentityId generation)
 *   - Computing counterfactual addresses per chain
 *   - Reading wallet state (identity + accounts + controllers)
 *   - Managing controllers (add/revoke)
 *   - Managing connected EOAs (link/unlink)
 */
@Controller('wallet')
export class WalletController {
  private readonly logger = new Logger(WalletController.name);

  constructor(
    private readonly walletIdentity: WalletIdentityService,
    private readonly walletControllerSvc: WalletControllerService,
    private readonly connectedWallets: ConnectedWalletService,
  ) {}

  // ──────────────────────────────────────────────────────────
  // Wallet Identity
  // ──────────────────────────────────────────────────────────

  /**
   * POST /wallet
   * Creates a new Verse Wallet identity for a Verse Profile.
   * Generates walletIdentityId — does NOT deploy on-chain yet.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWallet(@Body() dto: CreateWalletDto) {
    return this.walletIdentity.createWalletIdentity(dto.verseProfileId);
  }

  /**
   * POST /wallet/:walletId/address
   * Computes and stores the counterfactual address for a chain.
   * Requires the initial passkey public key (collected during passkey registration).
   */
  @Post(':walletId/address')
  @HttpCode(HttpStatus.CREATED)
  async computeAddress(
    @Param('walletId') walletId: string,
    @Body() dto: ComputeAddressDto,
  ) {
    return this.walletIdentity.computeAndStoreAddress({
      walletId,
      chainId: dto.chainId,
      initialPasskeyX: BigInt(dto.initialPasskeyX),
      initialPasskeyY: BigInt(dto.initialPasskeyY),
      passkeyCredentialId: dto.passkeyCredentialId,
    });
  }

  /**
   * GET /wallet/profile/:profileId
   * Returns the wallet identity, all chain accounts, and active controllers.
   */
  @Get('profile/:profileId')
  async getWalletByProfile(@Param('profileId') profileId: string) {
    const wallet = await this.walletIdentity.getWalletForProfile(profileId);

    if (!wallet) {
      return { wallet: null, message: 'No wallet found for this profile.' };
    }

    return { wallet };
  }

  // ──────────────────────────────────────────────────────────
  // Controllers
  // ──────────────────────────────────────────────────────────

  /**
   * POST /wallet/:walletId/controller
   * Records a new validator controller for the wallet (passkey, mpc, or hardware).
   * Guardians are managed separately through wallet_guardians.
   * The controller is pending on-chain confirmation (confirmedOnChain = false).
   *
   * INV-19/20: Passkey = root validator at init; others = installModule post-deployment.
   */
  @Post(':walletId/controller')
  @HttpCode(HttpStatus.CREATED)
  async addController(
    @Param('walletId') walletId: string,
    @Body() dto: AddControllerDto,
  ) {
    return this.walletControllerSvc.addController({
      walletId,
      controllerType: dto.controllerType,
      controllerIdentifier: dto.controllerIdentifier,
      validatorContractAddress: dto.validatorContractAddress,
      onChainPublicData: dto.onChainPublicData,
      canSignTransactions: dto.canSignTransactions,
      canManageControllers: dto.canManageControllers,
      canInitiateRecovery: dto.canInitiateRecovery,
    });
  }

  /**
   * GET /wallet/:walletId/controllers
   * Returns all active (non-revoked) controllers for a wallet.
   */
  @Get(':walletId/controllers')
  async getControllers(@Param('walletId') walletId: string) {
    return this.walletControllerSvc.getActiveControllers(walletId, false);
  }

  /**
   * DELETE /wallet/:walletId/controller/:controllerId
   * Soft-revokes a controller record (sets revokedAt).
   * Must only be called AFTER the on-chain uninstallModule is confirmed.
   */
  @Delete(':walletId/controller/:controllerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeController(
    @Param('walletId') walletId: string,
    @Param('controllerId') controllerId: string,
  ) {
    await this.walletControllerSvc.revokeController(walletId, controllerId);
  }

  // ──────────────────────────────────────────────────────────
  // Connected EOAs (identity layer — NOT transaction signers)
  // ──────────────────────────────────────────────────────────

  /**
   * POST /wallet/connect-eoa
   * Links an external EOA to a Verse Profile for identity/display purposes.
   *
   * INV-14/15: This MUST NOT create a wallet_controllers entry.
   */
  @Post('connect-eoa')
  @HttpCode(HttpStatus.CREATED)
  async linkEOA(@Body() dto: LinkEOADto) {
    return this.connectedWallets.linkEOA(
      dto.verseProfileId,
      dto.address,
      dto.walletType,
    );
  }

  /**
   * GET /wallet/connected/:profileId
   * Returns all active connected EOAs for a profile.
   */
  @Get('connected/:profileId')
  async getConnectedEOAs(@Param('profileId') profileId: string) {
    return this.connectedWallets.getLinkedEOAs(profileId);
  }

  /**
   * DELETE /wallet/connect-eoa/:profileId/:address
   * Unlinks a connected EOA from a profile.
   */
  @Delete('connect-eoa/:profileId/:address')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlinkEOA(
    @Param('profileId') profileId: string,
    @Param('address') address: string,
  ) {
    await this.connectedWallets.unlinkEOA(profileId, address);
  }
}
