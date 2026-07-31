import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArenaModule } from './modules/arena/arena.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './db/db.module';
import { FeedModule } from 'src/modules/feed/feed.module';
import { ForgeModule } from 'src/modules/forge/forge.module';
import { ShowdownModule } from 'src/modules/showdown/showdown.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ArenaModule, GatewayModule, HealthModule, DatabaseModule, FeedModule, ForgeModule, ShowdownModule, QuestionsModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
