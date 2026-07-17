import {
  Body, Controller, Delete, Get, Param, Post, Patch, Query, Request,
  UseGuards, UseInterceptors, UploadedFile, UsePipes, ValidationPipe,
  ForbiddenException, NotFoundException, Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { JwtAuthGuard } from '../../shared/gurds/jwt-auth.guard';
import { ArenaIdentityService } from '../arena/arena-identity.service';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('v1/questions')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly identity: ArenaIdentityService,
    @Inject('DB') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreateQuestionDto, @Request() req) {
    const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);
    await this.assertCourseInScope(body.courseId, arenaUser);
    return this.questionsService.create(body);
  }

  @Get()
  async list(@Query('courseId') courseId: string) {
    if (!courseId) throw new (require('@nestjs/common').BadRequestException)('courseId is required.');
    return this.questionsService.list(courseId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() body: UpdateQuestionDto, @Request() req) {
    const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);
    const existing = await this.questionsService.getOrThrow(id);
    await this.assertCourseInScope(existing.courseId, arenaUser);
    return this.questionsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);
    const existing = await this.questionsService.getOrThrow(id);
    await this.assertCourseInScope(existing.courseId, arenaUser);
    return this.questionsService.delete(id);
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('courseId') courseId: string,
    @Request() req,
  ) {
    const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);
    if (!file) throw new (require('@nestjs/common').BadRequestException)('No file uploaded.');
    if (!courseId) throw new (require('@nestjs/common').BadRequestException)('courseId is required.');
    await this.assertCourseInScope(courseId, arenaUser);

    return this.questionsService.importCsv(courseId, file.buffer.toString('utf-8'));
  }

  private async assertCourseInScope(courseId: string, arenaUser: { role: string | null; schoolId: string }) {
    const course = await this.db.query.arenaCourses.findFirst({
      where: (c, { eq }) => eq(c.id, courseId),
    });
    if (!course) throw new NotFoundException('Course not found.');
    if (arenaUser.role !== 'admin' && course.schoolId !== arenaUser.schoolId) {
      throw new ForbiddenException('Cannot manage questions for a course outside your school.');
    }
    return course;
  }
}