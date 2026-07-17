import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe,
    ForbiddenException,
    Inject,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { JwtAuthGuard } from '../../shared/gurds/jwt-auth.guard';
import { ShowdownService } from './showdown.service';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { CreateShowdownDto } from './dto/create-showdown.dto';
import { BuildBracketDto } from './dto/build-bracket.dto';
import { CreateDuelChallengeDto } from './dto/create-duel-challenge.dto';
import { ShowdownGateway } from './showdown.gateway';

@Controller('v1/showdown')
@UseGuards(JwtAuthGuard)
export class ShowdownController {
    constructor(
        private readonly showdownService: ShowdownService,
        private readonly identity: ArenaIdentityService,
        private readonly gateway: ShowdownGateway,
        @Inject('DB') private readonly db: NodePgDatabase<typeof schema>,
    ) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() body: CreateShowdownDto, @Request() req) {
        const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);

        const course = await this.db.query.arenaCourses.findFirst({
            where: (c, { eq }) => eq(c.id, body.courseId),
        });
        if (!course || (arenaUser.role !== 'admin' && course.schoolId !== arenaUser.schoolId)) {
            throw new ForbiddenException('Cannot create a showdown for a course outside your school.');
        }

        return this.showdownService.create(arenaUser.id, body);
    }

    @Get('feed')
    async getFeed(@Query('courseId') courseId: string, @Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.showdownService.getFeed(courseId, arenaUser.id);
    }

    @Get(':id')
    async getState(@Param('id') id: string) {
        return this.showdownService.getFullState(id);
    }

    @Get()
    async listForCourse(@Query('courseId') courseId: string) {
        return this.db.query.showdowns.findMany({
            where: (s, { eq }) => eq(s.courseId, courseId),
            orderBy: (s, { desc }) => [desc(s.createdAt)],
        });
    }

    @Post(':id/lobby')
    async openLobby(@Param('id') id: string, @Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.showdownService.openLobby(id, arenaUser.id);
    }

    @Post(':id/bracket')
    @UsePipes(new ValidationPipe({ transform: true }))
    async buildBracket(
        @Param('id') id: string,
        @Body() body: BuildBracketDto,
        @Request() req,
    ) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.showdownService.buildBracket(id, arenaUser.id, body.arenaUserIds);
    }

    @Post(':id/matches/:matchId/start')
    async startMatch(
        @Param('id') id: string,
        @Param('matchId') matchId: string,
        @Request() req,
    ) {
        const arenaUser = await this.identity.resolve(req.user.id);
        await this.showdownService.startMatch(id, matchId, arenaUser.id);
        return this.showdownService.getFullState(id);
    }

    @Post(':id/matches/:matchId/resolve')
    async resolveQuestion(
        @Param('id') id: string,
        @Param('matchId') matchId: string,
        @Request() req,
    ) {
        const arenaUser = await this.identity.resolve(req.user.id);
        await this.showdownService.resolveQuestion(id, matchId, arenaUser.id);
        return this.showdownService.getFullState(id);
    }

    @Post(':id/matches/:matchId/next-question')
    async nextQuestion(
        @Param('id') id: string,
        @Param('matchId') matchId: string,
        @Request() req,
    ) {
        const arenaUser = await this.identity.resolve(req.user.id);
        await this.showdownService.nextQuestion(id, matchId, arenaUser.id);
        return this.showdownService.getFullState(id);
    }

    @Post(':id/advance')
    async advance(@Param('id') id: string, @Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.showdownService.advance(id, arenaUser.id);
    }

    @Post('duel/challenge')
    @UsePipes(new ValidationPipe({ transform: true }))
    async challenge(@Body() body: CreateDuelChallengeDto, @Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        const showdown = await this.showdownService.createDuelChallenge(arenaUser.id, body);

        this.gateway.notifyChallenge(body.opponentArenaUserId, {
            showdownId: showdown.id,
            fromArenaUserId: arenaUser.id,
            fromUsername: req.user.username,
        });

        return showdown;
    }

    @Get('duel/pending')
    async listPendingChallenges(@Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.showdownService.listIncomingChallenges(arenaUser.id);
    }

    @Get('duel/sent')
    async listSentChallenges(@Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.showdownService.listOutgoingChallenges(arenaUser.id);
    }


}