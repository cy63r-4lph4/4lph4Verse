import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/gurds/jwt-auth.guard';
import { FeedService } from './feed.service';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FeedGateway } from 'src/modules/feed/feed.gateway';
import { ReactDto } from 'src/modules/feed/dto/react.dto';

@Controller('v1/feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
    constructor(
        private readonly feedService: FeedService,
        private readonly identity: ArenaIdentityService,
        private readonly gateway: FeedGateway,
    ) { }

    @Get()
    async getFeed(@Query('courseId') courseId: string, @Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.feedService.getFeed(courseId, arenaUser.id);
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createPost(@Body() body: CreatePostDto, @Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        const post = await this.feedService.createPost(arenaUser.id, body);
        this.gateway.notifyNewPost(body.courseId, post);
        return post;
    }

    @Delete(':postId')
    async deletePost(@Param('postId') postId: string, @Request() req) {
        const arenaUser = await this.identity.resolve(req.user.id);
        await this.feedService.deletePost(postId, arenaUser.id);
        return { deleted: true };
    }

    @Patch(':postId/pin')
    async setPinned(
        @Param('postId') postId: string,
        @Body('pinned') pinned: boolean,
        @Request() req,
    ) {
        const arenaUser = await this.identity.resolve(req.user.id);
        return this.feedService.setPinned(postId, arenaUser.id, pinned);
    }

    @Post(':postId/comments')
    @UsePipes(new ValidationPipe({ transform: true }))
    async addComment(
        @Param('postId') postId: string,
        @Body() body: CreateCommentDto,
        @Request() req,
    ) {
        const arenaUser = await this.identity.resolve(req.user.id);
        const comment = await this.feedService.addComment(postId, arenaUser.id, body.content);
        this.gateway.notifyNewComment(postId, comment);
        return comment;
    }

    @Get(':postId/comments')
    async listComments(@Param('postId') postId: string) {
        return this.feedService.listComments(postId);
    }

    @Post(':postId/react')
    @UsePipes(new ValidationPipe({ transform: true }))
    async react(
        @Param('postId') postId: string,
        @Body() body: ReactDto,
        @Request() req,
    ) {
        const arenaUser = await this.identity.resolve(req.user.id);
        const result = await this.feedService.toggleReaction(postId, arenaUser.id, body.type);
        this.gateway.notifyReaction(postId, { arenaUserId: arenaUser.id, type: body.type, active: result.active });
        return result;
    }
}