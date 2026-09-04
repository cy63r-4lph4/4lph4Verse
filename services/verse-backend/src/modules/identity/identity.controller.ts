import { Controller, Post, Body } from '@nestjs/common';
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
}
