import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionController } from './question.controller';
import { ArenaIdentityService } from '../arena/arena-identity.service';

@Module({
    controllers: [QuestionController],
    providers: [QuestionsService, ArenaIdentityService],
    exports: [QuestionsService],
})
export class QuestionsModule { }