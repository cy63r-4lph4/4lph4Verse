import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';

@Injectable()
export class ArenaIdentityService {
  constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

  async resolve(userId: string) {
    const arenaUser = await this.db.query.arenaUser.findFirst({
      where: (au, { eq }) => eq(au.userId, userId),
    });
    if (!arenaUser) {
      throw new ForbiddenException('No arena profile for this account.');
    }
    return arenaUser; // { id, userId, schoolId, role, ... }
  }

  async requireInstructorOrAdmin(userId: string) {
    const arenaUser = await this.resolve(userId);
    if (arenaUser.role !== 'instructor' && arenaUser.role !== 'admin') {
      throw new ForbiddenException('Instructor or admin role required.');
    }
    return arenaUser;
  }
}