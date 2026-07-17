import { Body, Controller, Get, Param, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/gurds/jwt-auth.guard';
import { ForgeService } from './forge.service';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { SubmitQuestionDto } from './dto/submit-question.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

@Controller('v1/forge')
@UseGuards(JwtAuthGuard)
export class ForgeController {
  constructor(
    private readonly forgeService: ForgeService,
    private readonly identity: ArenaIdentityService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async submit(@Body() body: SubmitQuestionDto, @Request() req) {
    const arenaUser = await this.identity.resolve(req.user.id);
    return this.forgeService.submit(arenaUser.id, body);
  }

  @Get('mine')
  async listMine(@Query('courseId') courseId: string, @Request() req) {
    const arenaUser = await this.identity.resolve(req.user.id);
    return this.forgeService.listMine(courseId, arenaUser.id);
  }

  @Get('pending')
  async listPending(@Query('courseId') courseId: string, @Request() req) {
    await this.identity.requireInstructorOrAdmin(req.user.id);
    return this.forgeService.listPending(courseId);
  }

  @Post(':id/approve')
  @UsePipes(new ValidationPipe({ transform: true }))
  async approve(@Param('id') id: string, @Body() body: ReviewSubmissionDto, @Request() req) {
    const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);
    return this.forgeService.approve(id, arenaUser.id, body.note);
  }

  @Post(':id/reject')
  @UsePipes(new ValidationPipe({ transform: true }))
  async reject(@Param('id') id: string, @Body() body: ReviewSubmissionDto, @Request() req) {
    const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);
    return this.forgeService.reject(id, arenaUser.id, body.note);
  }
}