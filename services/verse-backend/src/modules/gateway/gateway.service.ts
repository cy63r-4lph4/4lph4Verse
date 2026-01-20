import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { or } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { RegisterDto } from 'src/modules/gateway/dto/register';
import * as schema from 'src/db/schema';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GatewayService {
  constructor(
    @Inject("DB") private db: NodePgDatabase<typeof schema>,
    private jwtService: JwtService
  ) {}

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
          'This codename or email is already taken!',
        );
      }

      const school = await tx.query.arenaSchools.findFirst({
        where: (arenaSchools, { eq }) => eq(arenaSchools.id, user.sector),
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
          schoolId: user.sector,
        })
        .returning();
const payload={sub:newUser.id,username:newUser.username};
const token=await this.jwtService.signAsync(payload);
      return {
        access_token:token,
        user: {
          id:newUser.id,
          username:newUser.username,
        },
        sectors:[]
      };
    });
  }

  async checkExists(username: string): Promise<boolean> {
      const cleanUsername = username.trim();

  const user = await this.db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, cleanUsername),
    columns: { id: true }, 
  });

  return !!user;
}

async getUniversities(): Promise<{ id: string; name: string; slug: string | null }[]> {
  const universities = await this.db.query.arenaSchools.findMany({
    columns: { 
      id: true, 
      name: true, 
      slug: true 
    },
  });

  return universities;
}
}
