import { Controller, Post, Body, Param } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('profile')
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    const profile = await this.identityService.createProfile(createProfileDto);
    return {
      success: true,
      data: profile,
    };
  }

  @Post('profile/:profileId/mint')
  async mintProfile(
    @Param('profileId') profileId: string,
    @Body() body: { walletAddress: string; chainId: number }
  ) {
    const receipt = await this.identityService.mintProfileNFT(
      profileId,
      body.walletAddress,
      body.chainId
    );
    return {
      success: true,
      txHash: receipt.hash,
    };
  }
}
