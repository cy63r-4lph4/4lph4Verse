import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards, Inject, Request, Query, Delete } from '@nestjs/common';
import { ArenaService } from './arena.service';
import { JwtAuthGuard } from '../../shared/gurds/jwt-auth.guard';
import { RolesGuard } from '../../shared/gurds/roles.gurd';
import { ArenaIdentityService } from 'src/modules/arena/arena-identity.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';


@Controller('v1/arena')
@UseGuards(JwtAuthGuard)
export class ArenaController {
  constructor(
    private readonly arenaService: ArenaService,
    private readonly identity: ArenaIdentityService,
    @Inject('DB') private readonly db: NodePgDatabase<typeof schema>,
  ) { }
  @Get('courses/:id')
  async getCourseDetail(@Param('id') courseId: string) {
    return this.arenaService.getCourseDetail(courseId);
  }
  @Get('courses/:id/members')
  async getCourseMembers(@Param('id') courseId: string, @Request() req) {
    const arenaUser = await this.identity.requireInstructorOrAdmin(req.user.id);

    const course = await this.db.query.arenaCourses.findFirst({
      where: (c, { eq }) => eq(c.id, courseId),
    });
    if (!course) {
      throw new (require('@nestjs/common').NotFoundException)('Course not found.');
    }
    if (arenaUser.role !== 'admin' && course.schoolId !== arenaUser.schoolId) {
      throw new ForbiddenException('Cannot view members for a course outside your school.');
    }

    return this.arenaService.getCourseMembers(courseId);
  }

  @Get('courses/:id/leaderboard')
  async getCourseLeaderboard(@Param('id') courseId: string) {
    const course = await this.db.query.arenaCourses.findFirst({
      where: (c, { eq }) => eq(c.id, courseId),
    });
    if (!course) {
      throw new (require('@nestjs/common').NotFoundException)('Course not found.');
    }
    return this.arenaService.getCourseLeaderboard(courseId);
  }

}

@Controller('v1/arena/su')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly arenaService: ArenaService) { }

  @Post('institution')
  async createInstitution(@Body() body: { name: string; slug: string }) {
    return this.arenaService.createInstitution(body);
  }

  @Get('institutions')
  async listInstitutions() {
    return this.arenaService.listSchoolsWithStats();
  }

  @Delete('institution/:id')
  async deleteInstitution(@Param('id') id: string) {
    return this.arenaService.deleteInstitution(id);
  }

  @Post('course')
  async createCourse(@Body() body: { title: string; code: string; schoolId: string }) {
    return this.arenaService.createCourse(body);
  }

  @Delete('course/:id')
  async deleteCourse(@Param('id') id: string) {
    return this.arenaService.deleteCourse(id);
  }

  @Get('institution/:id/sectors')
  async getSectorsByInstitution(@Param('id') institutionId: string) {
    return this.arenaService.getInstitutionSectors(institutionId);
  }

  @Post('instructor')
  async createInstructor(@Body() body: { username: string; password: string; email?: string; schoolId: string }) {
    return this.arenaService.createInstructor(body);
  }

  @Get('instructors')
  async listInstructors(@Query('schoolId') schoolId?: string) {
    return this.arenaService.listInstructors(schoolId);
  }

  @Get('stats')
  async getStats() {
    return this.arenaService.getPlatformStats();
  }
}
