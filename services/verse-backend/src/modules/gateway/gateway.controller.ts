import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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
}