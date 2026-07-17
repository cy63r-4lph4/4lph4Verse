import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class ForgeService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly questionsService: QuestionsService,
  ) { }
  async submit(submittedByArenaUserId: string, dto: {
    courseId: string; prompt: string; options: string[]; correctIndex: number;
    difficulty?: 'easy' | 'medium' | 'hard'; category?: string;
  }) {
    if (dto.correctIndex >= dto.options.length) {
      throw new BadRequestException('correctIndex out of range for supplied options.');
    }

    const [submission] = await this.db.insert(schema.forgeSubmissions).values({
      courseId: dto.courseId,
      submittedByArenaUserId,
      prompt: dto.prompt,
      options: dto.options,
      correctIndex: dto.correctIndex,
      difficulty: dto.difficulty ?? 'medium',
      category: dto.category,
    }).returning();

    return submission;
  }

  async listMine(courseId: string, arenaUserId: string) {
    return this.db.query.forgeSubmissions.findMany({
      where: (s, { eq, and }) => and(eq(s.courseId, courseId), eq(s.submittedByArenaUserId, arenaUserId)),
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    });
  }

  async listPending(courseId: string) {
    return this.db.query.forgeSubmissions.findMany({
      where: (s, { eq, and }) => and(eq(s.courseId, courseId), eq(s.status, 'pending')),
      orderBy: (s, { asc }) => [asc(s.createdAt)],
      with: { submittedBy: { with: { user: true } } },
    });
  }

  async approve(submissionId: string, reviewerArenaUserId: string, note?: string) {
    const submission = await this.getSubmissionOrThrow(submissionId);
    if (submission.status !== 'pending') {
      throw new BadRequestException('This submission has already been reviewed.');
    }

    const question = await this.questionsService.create({
      courseId: submission.courseId,
      prompt: submission.prompt,
      options: submission.options as string[],
      correctIndex: submission.correctIndex,
      difficulty: submission.difficulty,
      category: submission.category ?? undefined,
    });

    const [updated] = await this.db.update(schema.forgeSubmissions)
      .set({
        status: 'approved',
        reviewedByArenaUserId: reviewerArenaUserId,
        reviewNote: note,
        approvedQuestionId: question.id,
      })
      .where(eq(schema.forgeSubmissions.id, submissionId))
      .returning();

    return updated;
  }


  async reject(submissionId: string, reviewerArenaUserId: string, note?: string) {
    const submission = await this.getSubmissionOrThrow(submissionId);
    if (submission.status !== 'pending') {
      throw new BadRequestException('This submission has already been reviewed.');
    }

    const [updated] = await this.db.update(schema.forgeSubmissions)
      .set({ status: 'rejected', reviewedByArenaUserId: reviewerArenaUserId, reviewNote: note })
      .where(eq(schema.forgeSubmissions.id, submissionId))
      .returning();

    return updated;
  }

  private async getSubmissionOrThrow(submissionId: string) {
    const submission = await this.db.query.forgeSubmissions.findFirst({
      where: (s, { eq }) => eq(s.id, submissionId),
    });
    if (!submission) throw new NotFoundException('Submission not found.');
    return submission;
  }
}