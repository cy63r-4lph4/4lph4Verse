import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { RegisterDto } from './dto/register';

@Controller('v1/gateway') 
export class GatewayController {
    constructor(private readonly gatewayService: GatewayService) {}     

    @Post("register") 
    @UsePipes(new ValidationPipe({ transform: true })) 
    async register(@Body() body: RegisterDto) {
        return await this.gatewayService.registerUser(body);
    }
    @Get("check-username/:username") 
    async checkAvailability(@Param('username')username:string) {
        const exists=await this.gatewayService.checkExists(username);
        return {available:!exists}
    }
    @Get("universities")
    async getUniversities() {
        const universities=await this.gatewayService.getUniversities();
        return universities;
    }
}