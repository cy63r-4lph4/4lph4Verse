import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/db.module';
import { WalletController } from './wallet.controller';
import { WalletIdentityService } from './services/wallet-identity.service';
import { WalletControllerService } from './services/wallet-controller.service';
import { ConnectedWalletService } from './services/connected-wallet.service';
import { ChainConfigService } from './services/chain-config.service';

/**
 * WalletModule — Verse Wallet Infrastructure (v6)
 *
 * Services:
 *   ChainConfigService       — Per-chain contract addresses and verification registry
 *   WalletIdentityService    — Wallet identity creation, address derivation
 *   WalletControllerService  — Controller (passkey/MPC/hardware/guardian) management
 *   ConnectedWalletService   — External EOA linking (identity only, NOT signers)
 *
 * All services are exported so IdentityModule can use WalletIdentityService
 * during profile creation (auto-provisioning).
 */
@Module({
  imports: [DatabaseModule],
  controllers: [WalletController],
  providers: [
    ChainConfigService,
    WalletIdentityService,
    WalletControllerService,
    ConnectedWalletService,
  ],
  exports: [
    ChainConfigService,
    WalletIdentityService,
    WalletControllerService,
    ConnectedWalletService,
  ],
})
export class WalletModule {}
