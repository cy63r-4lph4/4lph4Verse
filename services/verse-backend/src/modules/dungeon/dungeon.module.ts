import { Module } from '@nestjs/common';
import { DungeonService } from './dungeon.service';
import { DungeonController } from './dungeon.controller';
import { ArenaIdentityService } from '../arena/arena-identity.service';

@Module({
  controllers: [DungeonController],
  providers: [DungeonService, ArenaIdentityService],
  exports: [DungeonService],
})
export class DungeonModule {}
