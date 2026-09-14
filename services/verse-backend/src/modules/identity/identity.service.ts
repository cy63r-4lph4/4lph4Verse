import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { WalletIdentityService } from '../wallet/services/wallet-identity.service';

@Injectable()
export class IdentityService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly walletIdentity: WalletIdentityService,
  ) {}

  async createProfile(dto: CreateProfileDto) {
    // 1. Check for handle uniqueness
    const existingHandle = await this.db.query.verseProfiles.findFirst({
      where: eq(schema.verseProfiles.handle, dto.handle),
    });

    if (existingHandle) {
      throw new ConflictException(`Handle ${dto.handle} is already taken.`);
    }

    // 2. Check for contact uniqueness
    const existingContact = await this.db.query.profileContacts.findFirst({
      where: eq(schema.profileContacts.value, dto.contactValue),
    });

    if (existingContact) {
      throw new ConflictException(
        `Contact ${dto.contactValue} is already associated with an account.`,
      );
    }

    // Wrap in a transaction
    const newProfile = await this.db.transaction(async (tx) => {
      // Create root user
      const [newUser] = await tx
        .insert(schema.users)
        .values({
          username: dto.handle,
          ...(dto.contactType === 'email' ? { email: dto.contactValue } : {}),
        })
        .returning();

      // Create VerseProfile
      const [profile] = await tx
        .insert(schema.verseProfiles)
        .values({
          userId: newUser.id,
          handle: dto.handle,
          displayName: dto.displayName,
        })
        .returning();

      // Create Profile Contact
      await tx.insert(schema.profileContacts).values({
        profileId: profile.id,
        type: dto.contactType,
        value: dto.contactValue,
        isPrimary: true,
      });

      return profile;
    });

    // Auto-provision Verse Wallet identity (v6 architecture)
    // This creates the walletIdentityId (immutable identity anchor).
    // The counterfactual address per chain is computed lazily when the
    // user registers their first passkey (PasskeyCredentialId required).
    // INV-01: walletIdentityId is immutable after creation.
    // INV-04: walletIdentitySeed is generated and immediately discarded.
    await this.walletIdentity.createWalletIdentity(newProfile.id);

    // TODO: Trigger gasless relay to mint NFT and assign owner (Smart Contract Alignment)

    return newProfile;
  }
}
