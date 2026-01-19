import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArenaModule } from './modules/arena/arena.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './db/db.module';

@Module({
  imports: [ArenaModule, GatewayModule, HealthModule,DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
