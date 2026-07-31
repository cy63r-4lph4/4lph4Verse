import { BadRequestException, Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { or, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { RegisterDto } from './dto/register';
import * as schema from '../../db/schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login';
import { MailService } from '../mail/mail.service';

@Injectable()
export class GatewayService {
  constructor(
    @Inject("DB") private db: NodePgDatabase<typeof schema>,
    private jwtService: JwtService,
    private mailService: MailService
  ) { }

  async registerUser(user: RegisterDto) {
    const cleanUsername = user.username.trim();
    const cleanEmail =
      user.email && user.email.trim().length > 0
        ? user.email.toLowerCase().trim()
        : null;

    const result = await this.db.transaction(async (tx) => {
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
      const verifyToken = crypto.randomBytes(32).toString('hex');

      const [newUser] = await tx
        .insert(schema.users)
        .values({
          username: cleanUsername,
          email: cleanEmail,
          emailVerifyToken: verifyToken,
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
      const payload = { sub: newUser.id, username: newUser.username };
      const token = await this.jwtService.signAsync(payload);
      
      return {
        access_token: token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
        verifyToken,
        sectors: []
      };
    });

    if (result.user.email) {
      this.mailService.sendWelcomeVerification(result.user.email, result.user.username, result.verifyToken).catch(console.error);
    }

    return {
        access_token: result.access_token,
        user: {
            id: result.user.id,
            username: result.user.username,
        },
        sectors: result.sectors
    };
  }

  async verifyEmail(token: string) {
    if (!token) {
        throw new BadRequestException('Invalid verification token.');
    }

    const cleanToken = token.trim();

    return await this.db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
            where: (users, { eq }) => eq(users.emailVerifyToken, cleanToken),
        });

        if (!user) {
            throw new BadRequestException('Invalid or expired verification token.');
        }

        if (user.emailVerified) {
            return { message: 'Email already verified.' };
        }

        await tx.update(schema.users)
            .set({
                emailVerified: true,
                emailVerifyToken: null,
            })
            .where(eq(schema.users.id, user.id));

        return { message: 'Email verified successfully.' };
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

  async getUniversities(includeSystem:boolean=false): Promise<{ id: string; name: string; slug: string | null }[]> {
    const universities = await this.db.query.arenaSchools.findMany({
      where: (schools, { ne, and }) => {
            if (!includeSystem) {
                return ne(schools.slug, 'arena-core'); 
            }
            return undefined;
        },
        columns: {
            id: true,
            name: true,
            slug: true
        },
    });

    return universities;
  }

  /**
     * FETCH JOINED SECTORS
     * Uses the base userId to find the arenaProfile, then returns joined courses.
     */
  async mySectors(userId: string) {
    return await this.db
      .select({
        id: schema.arenaCourses.id,
        title: schema.arenaCourses.title,
        code: schema.arenaCourses.code,
        accessKey: schema.arenaCourses.accessKey,
      })
      .from(schema.arenaUserCourses)
      .innerJoin(
        schema.arenaCourses,
        eq(schema.arenaUserCourses.courseId, schema.arenaCourses.id)
      )
      .innerJoin(
        schema.arenaUser,
        eq(schema.arenaUserCourses.userId, schema.arenaUser.id)
      )
      .where(eq(schema.arenaUser.userId, userId));
  }

  /**
   * FETCH DISCOVERABLE SECTORS
   * Only returns courses within the user's school that they haven't joined.
   */
  async getDiscoverableSectors(userId: string) {
    const userProfile = await this.db.query.arenaUser.findFirst({
      where: (au, { eq }) => eq(au.userId, userId),
    });
    if (!userProfile) return [];

    const joinedCourses = await this.db
      .select({ courseId: schema.arenaUserCourses.courseId })
      .from(schema.arenaUserCourses)
      .where(eq(schema.arenaUserCourses.userId, userProfile.id));

    const joinedIds = joinedCourses.map((c) => c.courseId);

    return await this.db.query.arenaCourses.findMany({
      where: (courses, { eq, and, notInArray }) => {
        const conditions = [eq(courses.schoolId, userProfile.schoolId)];
        if (joinedIds.length > 0) {
          conditions.push(notInArray(courses.id, joinedIds));
        }
        return and(...conditions);
      },
      columns: { id: true, title: true, code: true, accessKey: true }
    });
  }

  async getSectorInfoByAccessKey(accessKey: string) {
    const cleanKey = accessKey.trim().toUpperCase();

    const course = await this.db.query.arenaCourses.findFirst({
      where: (courses, { eq }) => eq(courses.accessKey, cleanKey),
      with: {
        school: true,
      },
    });

    if (!course) {
      throw new BadRequestException('INVALID_ACCESS_KEY: Sector not found.');
    }

    return {
      id: course.id,
      title: course.title,
      code: course.code,
      accessKey: course.accessKey,
      schoolId: course.schoolId,
      schoolName: course.school?.name ?? null,
    };
  }

  /**
   * JOIN SECTOR
   * Authenticates the access key and links the arenaUser profile to the course.
   */
  async joinSector(userId: string, accessKey: string) {
    const cleanKey = accessKey.trim().toUpperCase();

    return await this.db.transaction(async (tx) => {
      // 1. Validate Course
      const course = await tx.query.arenaCourses.findFirst({
        where: (courses, { eq }) => eq(courses.accessKey, cleanKey),
      });

      if (!course) {
        throw new BadRequestException('INVALID_ACCESS_KEY: Sector not found.');
      }

      // 2. Validate Arena Profile
      const userProfile = await tx.query.arenaUser.findFirst({
        where: (au, { eq }) => eq(au.userId, userId),
      });

      if (!userProfile) {
        throw new ForbiddenException('USER_NOT_INITIALIZED: No school affiliation.');
      }

      // 3. Institutional Check with Auto-Alignment
      if (course.schoolId !== userProfile.schoolId) {
        const userCourses = await tx.query.arenaUserCourses.findMany({
          where: (auc, { eq }) => eq(auc.userId, userProfile.id),
        });

        if (userCourses.length === 0) {
          await tx
            .update(schema.arenaUser)
            .set({ schoolId: course.schoolId })
            .where(eq(schema.arenaUser.id, userProfile.id));

          userProfile.schoolId = course.schoolId;
        } else {
          throw new ForbiddenException('INSTITUTIONAL_MISMATCH: Unauthorized Hub.');
        }
      }

      // 4. Check Duplicate (using userProfile.id, not the base userId)
      const existingLink = await tx.query.arenaUserCourses.findFirst({
        where: (auc, { and, eq }) =>
          and(eq(auc.userId, userProfile.id), eq(auc.courseId, course.id)),
      });

      if (existingLink) {
        return { message: 'Uplink already active', courseId: course.id };
      }

      // 5. Establish Link
      await tx.insert(schema.arenaUserCourses).values({
        userId: userProfile.id, // Linking internal Arena ID
        courseId: course.id,
      });

      return {
        message: 'Uplink established successfully',
        courseId: course.id,
        title: course.title,
        code: course.code,
        userId: userProfile.userId, // Include userId for email fetching
      };
    });
  }

  async joinSectorWrapper(userId: string, accessKey: string) {
    const result = await this.joinSector(userId, accessKey);
    
    if (result.userId && result.title && result.code) {
        try {
            const user = await this.db.query.users.findFirst({
                where: (u, { eq }) => eq(u.id, result.userId)
            });
            if (user && user.email) {
                this.mailService.sendCourseJoined(user.email, user.username, result.code).catch(console.error);
            }
        } catch (err) {
            console.error("Failed to send course joined email:", err);
        }
    }
    
    // Clean up internal fields
    delete (result as any).userId;
    
    return result;
  }

  async login(credentials: LoginDto) {
    const { identity, password } = credentials;
    const cleanIdentity = identity.trim();

    const user = await this.db.query.users.findFirst({
      where: (users, { eq, or }) => or(
        eq(users.username, cleanIdentity),
        eq(users.email, cleanIdentity.toLowerCase())
      ),
      with:{arenaUser:true}
    });

    if (!user) {
      throw new BadRequestException('Invalid tactical credentials.');
    }

    // 2. Fetch the hashed password
    const storedCreds = await this.db.query.userCredentials.findFirst({
      where: (uc, { eq }) => eq(uc.userId, user.id),
    });

    if (!storedCreds) {
      throw new BadRequestException('Invalid tactical credentials.');
    }

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, storedCreds.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Invalid tactical credentials.');
    }

    // 4. Get active sectors (courses) for the redirection logic
    const activeSectors = await this.mySectors(user.id);

    // 5. Generate Payload & Token
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.arenaUser?.role,
      },
      sectors: activeSectors
    };
  }

 

}