import { Module } from '@nestjs/common';
import { ForgeService } from './forge.service';
import { ForgeController } from './forge.controller';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { QuestionsModule } from 'src/modules/questions/questions.module';

@Module({
  imports: [QuestionsModule],
  controllers: [ForgeController],
  providers: [ForgeService, ArenaIdentityService],
})
export class ForgeModule {}