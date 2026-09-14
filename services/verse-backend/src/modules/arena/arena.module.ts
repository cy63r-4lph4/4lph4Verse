import { Module } from '@nestjs/common';
import { AdminController, ArenaController } from './arena.controller';
import { ArenaService } from './arena.service';
import { ArenaIdentityService } from './arena-identity.service';

import { PdfService } from './pdf.service';

@Module({
  controllers: [ArenaController, AdminController],
  providers: [ArenaService, ArenaIdentityService, PdfService],
})
export class ArenaModule {}
