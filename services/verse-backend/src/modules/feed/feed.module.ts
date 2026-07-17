import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedGateway } from './feed.gateway';
import { GatewayModule } from '../gateway/gateway.module';
import { ShowdownModule } from '../showdown/showdown.module';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { PresenceModule } from '../presence/presence.module';

@Module({
  imports: [GatewayModule, ShowdownModule, PresenceModule],
  controllers: [FeedController],
  providers: [FeedService, FeedGateway, ArenaIdentityService],
})
export class FeedModule {}