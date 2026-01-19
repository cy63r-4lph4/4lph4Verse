import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { RegisterDto } from 'src/modules/gateway/dto/register';
import * as schema from 'src/db/schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GatewayService {
  constructor(@Inject("DB") private db: NodePgDatabase<typeof schema>) {}

  async registerUser(user: RegisterDto) {
    const cleanUsername = user.username.trim();
const cleanEmail =
  user.email && user.email.trim().length > 0
    ? user.email.toLowerCase().trim()
    : null;

    return await this.db.transaction(async (tx) => {
      const existingUser = await tx.query.users.findFirst({
  where: (users, { eq }) => {
    if (cleanEmail) {
      return or(
        eq(users.username, cleanUsername),
        eq(users.email, cleanEmail),
      );
    }

    return eq(users.username, cleanUsername);
  },
});


      if (existingUser) {
        throw new BadRequestException(
          'This fighter name or email is already taken!',
        );
      }

      const school = await tx.query.arenaSchools.findFirst({
        where: (arenaSchools, { eq }) => eq(arenaSchools.id, user.schoolId),
      });

      if (!school) {
        throw new BadRequestException('Invalid school selected');
      }

      const hashedPass = await bcrypt.hash(user.password.trim(), 10);

      const [newUser] = await tx
        .insert(schema.users)
        .values({
          username: cleanUsername,
          email: cleanEmail,
        })
        .returning();

      await tx.insert(schema.userCredentials).values({
        userId: newUser.id,
        passwordHash: hashedPass,
      });

      const [membership] = await tx
        .insert(schema.arenaUser)
        .values({
          userId: newUser.id,
          schoolId: user.schoolId,
        })
        .returning();

      return {
        message: 'Fighter registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          schoolId: membership.schoolId,
        },
      };
    });
  }
}
