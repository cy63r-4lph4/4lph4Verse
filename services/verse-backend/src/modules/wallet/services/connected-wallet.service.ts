import { Injectable, Inject, Logger, ConflictException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and } from 'drizzle-orm';
import * as schema from '../../../db/schema';
import { connectedWallets } from '../../../db/schema/wallet/connected_wallets';

type ConnectedWalletRow = typeof connectedWallets.$inferSelect;

/**
 * ConnectedWalletService — Manages external EOA wallets linked to a Verse Profile.
 *
 * Connected wallets are user-imported external wallets (MetaMask, Rainbow, Ledger, etc.)
 * that a user links to their Verse Profile for identity/social purposes.
 *
 * CRITICAL: These are NOT authentication controllers and MUST NOT be used to
 * authorize transactions on the managed Verse Smart Account.
 *
 * INV-14: Connected EOAs MUST NOT appear in wallet_controllers.
 * INV-15: A connected EOA MUST NOT be used as a controller for a Verse Wallet.
 * INV-08: Authentication (via connected wallet) MUST NOT authorize fund movement.
 */
@Injectable()
export class ConnectedWalletService {
  private readonly logger = new Logger(ConnectedWalletService.name);

  constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

  /**
   * Links an external EOA to a Verse Profile.
   *
   * The user must sign a challenge to prove ownership of the address before
   * this is called (signature verification is handled upstream in the controller).
   *
   * INV-14/15: Explicitly does NOT touch wallet_controllers or wallet_accounts.
   */
  async linkEOA(
    verseProfileId: string,
    address: string,
    walletType: string = 'external',
  ): Promise<ConnectedWalletRow> {
    // Normalize address to lowercase for storage consistency
    const normalizedAddress = address.toLowerCase();

    const existing = await this.db.query.connectedWallets.findFirst({
      where: and(
        eq(connectedWallets.verseProfileId, verseProfileId),
        eq(connectedWallets.address, normalizedAddress),
      ),
    });

    if (existing) {
      if (!existing.isActive) {
        // Reactivate previously unlinked wallet
        await this.db
          .update(connectedWallets)
          .set({ isActive: true })
          .where(eq(connectedWallets.id, existing.id));

        return { ...existing, isActive: true } as ConnectedWalletRow;
      }

      throw new ConflictException(
        `Address ${address} is already linked to this profile.`,
      );
    }

    const [linked] = await this.db
      .insert(connectedWallets)
      .values({
        verseProfileId,
        address: normalizedAddress,
        walletType,
        isActive: true,
      })
      .returning();

    this.logger.log(`Linked EOA ${address} to profile ${verseProfileId}`);

    return linked as ConnectedWalletRow;
  }

  /**
   * Unlinks an external EOA from a Verse Profile (soft delete — sets isActive=false).
   */
  async unlinkEOA(verseProfileId: string, address: string): Promise<void> {
    const normalizedAddress = address.toLowerCase();

    await this.db
      .update(connectedWallets)
      .set({ isActive: false })
      .where(
        and(
          eq(connectedWallets.verseProfileId, verseProfileId),
          eq(connectedWallets.address, normalizedAddress),
        ),
      );

    this.logger.log(`Unlinked EOA ${address} from profile ${verseProfileId}`);
  }

  /**
   * Returns all active connected EOAs for a Verse Profile.
   * These are DISPLAY ONLY — not transaction signers.
   */
  async getLinkedEOAs(verseProfileId: string) {
    return this.db.query.connectedWallets.findMany({
      where: and(
        eq(connectedWallets.verseProfileId, verseProfileId),
        eq(connectedWallets.isActive, true),
      ),
    });
  }
}
