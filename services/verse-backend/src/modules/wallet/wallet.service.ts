import { Injectable, Inject, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

  /**
   * Auto-provisions a smart wallet for a given profile using an ERC-4337 provider (e.g. Pimlico/Biconomy).
   */
  async provisionSmartWallet(profileId: string): Promise<any> {
    this.logger.log(`Provisioning smart wallet for profile: ${profileId}`);

    // TODO: Integrate with MPC/Passkey provider for key generation
    // TODO: Call Bundler/Paymaster provider to deploy smart account

    // Mock wallet generation
    const mockAddress =
      '0x' +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join('');

    const [wallet] = await this.db
      .insert(schema.profileWallets)
      .values({
        profileId,
        address: mockAddress,
        walletType: 'smart_account',
        supportedChains: '84532,42220', // E.g., Base Sepolia, Celo Alfajores
      })
      .returning();

    return wallet;
  }

  /**
   * Routes a transaction to the correct chain implicitly.
   */
  async routeTransaction(
    profileId: string,
    txData: any,
    targetChainId: number,
  ) {
    this.logger.log(
      `Routing transaction for profile: ${profileId} to chain: ${targetChainId}`,
    );
    // TODO: Provider-agnostic relay logic using Bundler
    return { success: true, txHash: '0xmockhash', targetChainId };
  }

  /**
   * Links an external EOA (like MetaMask) to the Verse Profile.
   */
  async linkExternalEOA(profileId: string, address: string) {
    this.logger.log(`Linking external EOA ${address} to profile: ${profileId}`);

    const [wallet] = await this.db
      .insert(schema.profileWallets)
      .values({
        profileId,
        address,
        walletType: 'imported_eoa',
      })
      .returning();

    return wallet;
  }
}
