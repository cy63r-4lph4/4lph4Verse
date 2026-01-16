import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
    @Get()
    health() {

        return {status: 'OK',
            service: 'Verse Backend',
             timestamp: new Date().toISOString()};
    }
}
