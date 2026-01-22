import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { RegisterDto } from './dto/register';
import { JwtAuthGuard } from './gurds/jwt-auth.guard';
import { JoinSectorDto } from './dto/joinSector';

@Controller('v1/gateway')
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) { }

    @Post("register")
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() body: RegisterDto) {
        return await this.gatewayService.registerUser(body);
    }
    @Get("check-username/:username")

    async checkAvailability(@Param('username') username: string) {
        const exists = await this.gatewayService.checkExists(username);
        return { available: !exists }
    }
    @Get("universities")
    async getUniversities() {
        const universities = await this.gatewayService.getUniversities();
        return universities;
    }
    @UseGuards(JwtAuthGuard)
    @Post("join-sector")
    async joinSector(
        @Body() body: JoinSectorDto,
        @Request() req
    ) {
        return await this.gatewayService.joinSector(req.user.id, body.accessKey);
    }
}