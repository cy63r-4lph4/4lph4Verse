import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArenaModule } from './modules/arena/arena.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [ArenaModule, GatewayModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
