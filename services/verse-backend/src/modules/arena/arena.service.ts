import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import * as schema from '../../db/schema';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';

@Injectable()
export class ArenaService {
    constructor(
        @Inject('DB') private readonly db: any
    ) { }







    // ── Institutions ─────────────────────────────────────────────────────

    async createInstitution(data: { name: string; slug: string }) {
        const [newSchool] = await this.db.insert(schema.arenaSchools).values({
            name: data.name,
            slug: data.slug.toLowerCase().trim(),
        }).returning();
        return newSchool;
    }

    async listSchoolsWithStats() {
        const schools = await this.db.query.arenaSchools.findMany({
            orderBy: (s: any, { desc }: any) => [desc(s.createdAt)],
        });

        return Promise.all(
            schools.map(async (school: any) => {
                const courses = await this.db.query.arenaCourses.findMany({
                    where: (c: any, { eq }: any) => eq(c.schoolId, school.id),
                });
                const fighters = await this.db.query.arenaUser.findMany({
                    where: (u: any, { eq }: any) => eq(u.schoolId, school.id),
                });
                return {
                    ...school,
                    sectors: courses.length,
                    fighters: fighters.length,
                };
            }),
        );
    }

    async listInstitutions() {
        return this.db.query.arenaSchools.findMany({
            orderBy: (s: any, { desc }: any) => [desc(s.createdAt)],
        });
    }

    async deleteInstitution(id: string) {
        const school = await this.db.query.arenaSchools.findFirst({
            where: (s: any, { eq }: any) => eq(s.id, id),
        });
        if (!school) throw new NotFoundException('Institution not found.');
        await this.db.delete(schema.arenaSchools).where(eq(schema.arenaSchools.id, id));
        return { deleted: true };
    }
    // ── Courses ──────────────────────────────────────────────────────────

    async createCourse(data: { title: string; code: string; schoolId: string }) {
        const generatedKey = randomBytes(4)
            .toString('hex')
            .toUpperCase()
            .match(/.{1,4}/g)
            ?.join('-') || 'CORE-GEN-000';

        const [newCourse] = await this.db.insert(schema.arenaCourses).values({
            title: data.title,
            code: data.code.toUpperCase().trim(),
            schoolId: data.schoolId,
            accessKey: generatedKey,
        }).returning();

        return newCourse;
    }
    async getCourseDetail(courseId: string) {
        const course = await this.db.query.arenaCourses.findFirst({
            where: (c: any, { eq }: any) => eq(c.id, courseId),
            with: {
                school: true,
                courseUsers: { columns: { userId: true } },
            },
        });
        if (!course) {
            throw new (require('@nestjs/common').NotFoundException)('Course not found.');
        }

        return {
            id: course.id,
            title: course.title,
            code: course.code,
            accessKey: course.accessKey,
            schoolId: course.schoolId,
            schoolName: course.school?.name,
            fighterCount: course.courseUsers.length,
            createdAt: course.createdAt,
        };
    }
    async deleteCourse(id: string) {
        const course = await this.db.query.arenaCourses.findFirst({
            where: (c: any, { eq }: any) => eq(c.id, id),
        });
        if (!course) throw new NotFoundException('Course not found.');
        await this.db.delete(schema.arenaCourses).where(eq(schema.arenaCourses.id, id));
        return { deleted: true };
    }

    async getInstitutionSectors(institutionId: string) {
        const data = await this.db.query.arenaCourses.findMany({
            where: (courses: any, { eq }: any) => eq(courses.schoolId, institutionId),
            columns: { id: true, title: true, code: true, accessKey: true, createdAt: true },
            with: {
                courseUsers: { columns: { userId: true } },
            },
        });

        return Promise.all(
            data.map(async (sector: any) => {
                const questionCount = await this.db.query.arenaQuestions.findMany({
                    where: (q: any, { eq }: any) => eq(q.courseId, sector.id),
                });
                return {
                    ...sector,
                    fighterCount: sector.courseUsers.length,
                    questionCount: questionCount.length,
                    courseUsers: undefined,
                };
            }),
        );
    }

    // ── Instructors ──────────────────────────────────────────────────────

    async createInstructor(data: { username: string; password: string; email?: string; schoolId: string }) {
        const cleanUsername = data.username.trim();
        const cleanEmail = data.email?.trim().toLowerCase() || null;

        return this.db.transaction(async (tx: any) => {
            const existing = await tx.query.users.findFirst({
                where: (u: any, { eq }: any) => eq(u.username, cleanUsername),
            });
            if (existing) throw new BadRequestException('Username already taken.');

            const passwordHash = await bcrypt.hash(data.password.trim(), 10);

            const [newUser] = await tx.insert(schema.users).values({
                username: cleanUsername,
                email: cleanEmail,
            }).returning();

            await tx.insert(schema.userCredentials).values({
                userId: newUser.id,
                passwordHash,
            });

            const [arenaUser] = await tx.insert(schema.arenaUser).values({
                userId: newUser.id,
                schoolId: data.schoolId,
                role: 'instructor',
            }).returning();

            return { id: newUser.id, username: newUser.username, arenaUserId: arenaUser.id, role: 'instructor' };
        });
    }

    async listInstructors(schoolId?: string) {
        return this.db.query.arenaUser.findMany({
            where: (u: any, { eq, and }: any) =>
                schoolId ? and(eq(u.role, 'instructor'), eq(u.schoolId, schoolId)) : eq(u.role, 'instructor'),
            with: { user: true, school: true },
        });
    }


    async getCourseMembers(courseId: string) {
        const course = await this.db.query.arenaCourses.findFirst({
            where: (c: any, { eq }: any) => eq(c.id, courseId),
        });
        if (!course) {
            throw new (require('@nestjs/common').NotFoundException)('Course not found.');
        }

        const memberships = await this.db.query.arenaUserCourses.findMany({
            where: (uc: any, { eq }: any) => eq(uc.courseId, courseId),
            with: {
                user: { with: { user: true } }, 
            },
        });

        return memberships
            .filter((m: any) => m.user?.user)
            .map((m: any) => ({
                arenaUserId: m.user.id,
                username: m.user.user.username,
                role: m.user.role,
                joinedAt: m.joinedAt,
            }));
    }

    // ── Platform stats ───────────────────────────────────────────────────

    async getPlatformStats() {
        const schools = await this.db.query.arenaSchools.findMany();
        const courses = await this.db.query.arenaCourses.findMany();
        const users = await this.db.query.users.findMany();
        const questions = await this.db.query.arenaQuestions.findMany();

        return {
            schoolCount: schools.length,
            courseCount: courses.length,
            userCount: users.length,
            questionCount: questions.length,
        };
    }
}
