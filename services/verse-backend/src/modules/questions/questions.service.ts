import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
type DbOrTx = NodePgDatabase<typeof schema>;

@Injectable()
export class QuestionsService {
  constructor(@Inject('DB') private readonly db: DbOrTx) { }

  async create(
    data: {
      courseId: string; prompt: string; options: string[]; correctIndex: number;
      difficulty?: 'easy' | 'medium' | 'hard'; category?: string;
    },
    tx?: DbOrTx,
  ) {
    if (data.correctIndex >= data.options.length) {
      throw new BadRequestException('correctIndex out of range for supplied options.');
    }

    const executor = tx ?? this.db;

    const [question] = await executor.insert(schema.arenaQuestions).values({
      courseId: data.courseId,
      prompt: data.prompt,
      options: data.options,
      correctIndex: data.correctIndex,
      difficulty: data.difficulty ?? 'medium',
      category: data.category,
    }).returning();

    return question;
  }

  async update(id: string, data: {
    prompt?: string; options?: string[]; correctIndex?: number;
    difficulty?: 'easy' | 'medium' | 'hard'; category?: string;
  }) {
    const existing = await this.getOrThrow(id);

    const options = data.options ?? (existing.options as string[]);
    const correctIndex = data.correctIndex ?? existing.correctIndex;
    if (correctIndex >= options.length) {
      throw new BadRequestException('correctIndex out of range for supplied options.');
    }

    const [updated] = await this.db.update(schema.arenaQuestions)
      .set({
        prompt: data.prompt ?? existing.prompt,
        options,
        correctIndex,
        difficulty: data.difficulty ?? existing.difficulty,
        category: data.category ?? existing.category,
      })
      .where(eq(schema.arenaQuestions.id, id))
      .returning();

    return updated;
  }

  async delete(id: string) {
    await this.getOrThrow(id);
    await this.db.delete(schema.arenaQuestions).where(eq(schema.arenaQuestions.id, id));
    return { deleted: true };
  }

  async list(courseId: string) {
    return this.db.query.arenaQuestions.findMany({
      where: (q, { eq }) => eq(q.courseId, courseId),
      orderBy: (q, { desc }) => [desc(q.createdAt)],
    });
  }

  async getOrThrow(id: string) {
    const question = await this.db.query.arenaQuestions.findFirst({
      where: (q, { eq }) => eq(q.id, id),
    });
    if (!question) throw new NotFoundException('Question not found.');
    return question;
  }

  /** Consumed by ShowdownService — picks a random unused question for a showdown, scoped to its course. */
  async pickUnused(courseId: string, excludeIds: string[]) {
    return this.db.query.arenaQuestions.findFirst({
      where: (q, { eq, notInArray, and }) => and(
        eq(q.courseId, courseId),
        excludeIds.length > 0 ? notInArray(q.id, excludeIds) : undefined,
      ),
    });
  }

  async importCsv(courseId: string, csvText: string) {
    const rows = this.parseCsv(csvText);
    if (rows.length === 0) {
      throw new BadRequestException('CSV has no data rows (or is missing a header row).');
    }

    const inserted: (typeof schema.arenaQuestions.$inferSelect)[] = [];
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const prompt = row.prompt?.trim();
        const options = [row.optionA, row.optionB, row.optionC, row.optionD]
          .map((o) => o?.trim())
          .filter((o): o is string => !!o && o.length > 0);
        const correctIndex = 'ABCD'.indexOf((row.correctLetter ?? '').trim().toUpperCase());
        const difficulty = ['easy', 'medium', 'hard'].includes(row.difficulty?.trim())
          ? (row.difficulty.trim() as 'easy' | 'medium' | 'hard')
          : 'medium';

        if (!prompt) throw new Error('Missing prompt');
        if (options.length < 2) throw new Error('Needs at least 2 non-empty options');
        if (correctIndex < 0 || correctIndex >= options.length) {
          throw new Error(`correctLetter "${row.correctLetter}" out of range for ${options.length} options`);
        }

        const question = await this.create({
          courseId, prompt, options, correctIndex, difficulty,
          category: row.category?.trim() || undefined,
        });
        inserted.push(question);
      } catch (err: any) {
        errors.push({ row: i + 2, message: err.message });
      }
    }

    return { insertedCount: inserted.length, errorCount: errors.length, inserted, errors };
  }

  private parseCsv(text: string): Record<string, string>[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = this.parseCsvLine(lines[0]).map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
      return row;
    });
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
      else { current += char; }
    }
    result.push(current);
    return result;
  }
}