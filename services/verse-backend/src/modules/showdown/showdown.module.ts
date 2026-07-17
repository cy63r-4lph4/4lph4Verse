import { Module } from '@nestjs/common';
import { ShowdownService } from './showdown.service';
import { ShowdownGateway } from './showdown.gateway';
import { ShowdownController } from './showdown.controller';
import { GatewayModule } from '../gateway/gateway.module';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { QuestionsModule } from 'src/modules/questions/questions.module';

@Module({
    imports: [GatewayModule, QuestionsModule],
    controllers: [ShowdownController],
    providers: [ShowdownService, ShowdownGateway, ArenaIdentityService],
    exports: [ShowdownService, ArenaIdentityService],
})
export class ShowdownModule { }