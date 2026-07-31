import { Body, Controller, Get, Inject, NotFoundException, Param, Post, Request, UseGuards, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { RegisterDto } from './dto/register';
import { JwtAuthGuard } from '../../shared/gurds/jwt-auth.guard';
import { JoinSectorDto } from './dto/joinSector';
import { LoginDto } from './dto/login';

@Controller('v1/gateway')
export class GatewayController {
    constructor(
        private readonly gatewayService: GatewayService,
        @Inject('DB') private readonly db: any
    ) { }


    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Request() req) {
        const user = await this.db.query.arenaUser.findFirst({
            where: (au, { eq }) => eq(au.userId, req.user.id),
            with: { user: true },
        });

        if (!user) throw new NotFoundException('User profile not found');

        return {
            id: user.userId,
            arenaUserId: user.id,
            username: user.user.username,
            role: user.role,
        };
    }

    @Post("register")
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() body: RegisterDto) {
        return await this.gatewayService.registerUser(body);
    }

    @Get("verify-email")
    async verifyEmail(@Query('token') token: string) {
        return await this.gatewayService.verifyEmail(token);
    }

    @Post("login")
    @UsePipes(new ValidationPipe({ transform: true }))
    async login(@Body() body: LoginDto) {
        return await this.gatewayService.login(body);
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

    @Get("sector-info/:accessKey")
    async getSectorInfo(@Param('accessKey') accessKey: string) {
        return await this.gatewayService.getSectorInfoByAccessKey(accessKey);
    }
    @Get("available-sectors")
    @UseGuards(JwtAuthGuard)
    async getSectors(@Request() req) {
        const sectors = await this.gatewayService.getDiscoverableSectors(req.user.id);
        return sectors;
    }
    @Get('my-sectors')
    @UseGuards(JwtAuthGuard)
    async getMySectors(@Request() req) {
        return this.gatewayService.mySectors(req.user.id);
    }

    @Post("join-sector")
    @UseGuards(JwtAuthGuard)

    async joinSector(
        @Body() body: JoinSectorDto,
        @Request() req
    ) {
        return await this.gatewayService.joinSectorWrapper(req.user.id, body.accessKey);
    }
}

