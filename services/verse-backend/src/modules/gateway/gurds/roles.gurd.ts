// src/modules/gateway/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(@Inject("DB") private db: NodePgDatabase<typeof schema>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest();

        const profile = await this.db.query.arenaUser.findFirst({
            where: (au, { eq }) => eq(au.userId, user.id),
        });

        if (profile?.role !== 'admin') {
            throw new ForbiddenException("INSUFFICIENT_PERMISSIONS: Admin override required.");
        }

        return true;
    }
}