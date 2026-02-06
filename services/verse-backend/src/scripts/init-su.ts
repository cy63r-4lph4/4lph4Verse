import { NestFactory } from '@nestjs/core';

import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { GatewayService } from '../modules/gateway/gateway.service';
import { AppModule } from '../app.module';

async function bootstrap() {
    // ApplicationContext loads the modules without starting the HTTP server
    const app = await NestFactory.createApplicationContext(AppModule);

    // Get your DB and Service instances from the Nest container
    const db = app.get('DB');
    const service = app.get(GatewayService);

    try {
        console.log('--- 🛠️  STARTING ADMIN INITIALIZATION ---');

        // 1. Create a "Ghost" System Hub
        // This satisfies the schoolId requirement without showing in public lists
        let systemHub = await db.query.arenaSchools.findFirst({
            where: (s, { eq }) => eq(s.slug, 'arena-core'),
        });

        if (!systemHub) {
            const [newHub] = await db.insert(schema.arenaSchools).values({
                name: 'ARENA_SYSTEM_CORE',
                slug: 'arena-core',
            }).returning();
            systemHub = newHub;
            console.log('✅ Created System Hub');
        }

        // 2. Register the SU Profile
        // Using your service logic ensures passwords are hashed and user records are linked
        const suData = {
            username: 'ARCHITECT',
            email: 'architect@arena.verse',
            password: 'AlphaVerse',
            sector: systemHub.id,
        };

        console.log(`📡 Provisioning user: ${suData.username}...`);

        // Check if exists to avoid 'Unique Constraint' errors on re-runs
        const exists = await service.checkExists(suData.username);
        let userId: string;

        if (!exists) {
            const result = await service.registerUser(suData);
            userId = result.user.id;
            console.log('✅ User Identity Created');
        } else {
            const existingUser = await db.query.users.findFirst({
                where: (u, { eq }) => eq(u.username, suData.username)
            });
            userId = existingUser.id;
            console.log('ℹ️  User already exists, proceeding to role upgrade...');
        }

        // 3. Force Role Upgrade
        // This is the manual override that gives you SU powers
        await db.update(schema.arenaUser)
            .set({ role: 'admin' })
            .where(eq(schema.arenaUser.userId, userId));

        console.log('👑 Role: ADMIN permissions granted.');
        console.log('--- 🚀 INITIALIZATION COMPLETE ---');

    } catch (error) {
        console.error('❌ CRITICAL ERROR:', error.message);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap();