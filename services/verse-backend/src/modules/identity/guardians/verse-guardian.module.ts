import { Module } from '@nestjs/common';
import { VerseGuardianService } from './verse-guardian.service';
import { VerseGuardianController } from './verse-guardian.controller';
import { DatabaseModule } from '../../../db/db.module';
import { RelayerModule } from '../../relayer/relayer.module';

@Module({
  imports: [DatabaseModule, RelayerModule],
  controllers: [VerseGuardianController],
  providers: [VerseGuardianService],
  exports: [VerseGuardianService],
})
export class VerseGuardianModule {}
