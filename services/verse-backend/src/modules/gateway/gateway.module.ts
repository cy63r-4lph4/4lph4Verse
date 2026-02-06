import { Module } from '@nestjs/common';
import { GatewayController, AdminController } from './gateway.controller'; // Don't forget AdminController
import { GatewayService } from './gateway.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'PILOT_SECRET_KEY',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [GatewayController, AdminController],
  providers: [GatewayService, JwtStrategy],
  exports: [GatewayService],
})
export class GatewayModule { }