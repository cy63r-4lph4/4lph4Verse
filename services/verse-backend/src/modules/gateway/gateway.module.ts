import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/modules/gateway/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'PILOT_SECRET_KEY',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService,JwtStrategy]
})
export class GatewayModule {}
