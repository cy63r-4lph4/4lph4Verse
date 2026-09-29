import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { DatabaseModule } from '../../db/db.module';
import { WalletModule } from '../wallet/wallet.module';
import { VerseGuardianModule } from './guardians/verse-guardian.module';
import { RelayerModule } from '../relayer/relayer.module';

@Module({
  imports: [DatabaseModule, WalletModule, VerseGuardianModule, RelayerModule],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
