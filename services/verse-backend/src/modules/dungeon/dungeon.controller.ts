import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/gurds/jwt-auth.guard';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { DungeonService } from './dungeon.service';

@Controller('v1/dungeon')
@UseGuards(JwtAuthGuard)
export class DungeonController {
  constructor(
    private readonly dungeonService: DungeonService,
    private readonly identity: ArenaIdentityService,
  ) {}

  /** Begin a new dungeon run. Optionally filter to a specific category. */
  @Post('start')
  async startRun(
    @Body() body: { courseId: string; category?: string },
    @Request() req,
  ) {
    const arenaUser = await this.identity.resolve(req.user.id);
    return this.dungeonService.startRun(
      arenaUser.id,
      body.courseId,
      body.category,
    );
  }

  /** Fetch the next question for an active run. Returns null when no questions remain. */
  @Get(':runId/next')
  async nextQuestion(@Param('runId') runId: string) {
    const question = await this.dungeonService.nextQuestion(runId);
    if (!question) {
      return { done: true, question: null };
    }
    return { done: false, question };
  }

  /** Submit an answer for the current question. Returns immediate feedback. */
  @Post(':runId/answer')
  async submitAnswer(
    @Param('runId') runId: string,
    @Body() body: { questionId: string; optionIndex: number },
  ) {
    return this.dungeonService.submitAnswer(
      runId,
      body.questionId,
      body.optionIndex,
    );
  }

  /** Get the full run summary (used for the death/complete screen). */
  @Get(':runId/summary')
  async getRunSummary(@Param('runId') runId: string) {
    return this.dungeonService.getRunSummary(runId);
  }

  /** List the user's past runs for a course. */
  @Get('history')
  async listMyRuns(@Query('courseId') courseId: string, @Request() req) {
    const arenaUser = await this.identity.resolve(req.user.id);
    return this.dungeonService.listMyRuns(arenaUser.id, courseId);
  }
}
