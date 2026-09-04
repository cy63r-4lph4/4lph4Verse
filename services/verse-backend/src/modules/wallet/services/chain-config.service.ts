import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../../../db/schema';
import { supportedChains } from '../../../db/schema/wallet/supported_chains';

/**
 * ChainConfigService — Manages the supported chain registry.
 *
 * This service is the single source of truth for per-chain contract addresses
 * and configuration required to:
 *   - Compute counterfactual wallet addresses (INV-21)
 *   - Submit UserOperations via bundler
 *   - Verify parity requirements (INV-12)
 *
 * Pre-implementation checklist: All chains must have nickFactoryVerified=true
 * and rip7212Verified=true before isActive can be set to true.
 */
@Injectable()
export class ChainConfigService {
  private readonly logger = new Logger(ChainConfigService.name);

  constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

  /** Returns the full chain config for a given chainId. */
  async getChain(chainId: number) {
    const chain = await this.db.query.supportedChains.findFirst({
      where: eq(supportedChains.chainId, chainId),
    });

    if (!chain) {
      throw new NotFoundException(`Chain ${chainId} is not registered.`);
    }

    return chain;
  }

  /** Returns all active chains available for wallet provisioning. */
  async getActiveChains() {
    return this.db.query.supportedChains.findMany({
      where: eq(supportedChains.isActive, true),
    });
  }

  /**
   * Returns chain config with required addresses for CREATE2 derivation.
   * Throws if the chain is not yet fully configured.
   */
  async getDerivationConfig(chainId: number): Promise<{
    chainId: number;
    kernelFactoryAddress: `0x${string}`;
    kernelImplAddress: `0x${string}`;
    passkeyValidatorAddress: `0x${string}`;
    entryPointAddress: `0x${string}`;
  }> {
    const chain = await this.getChain(chainId);

    if (
      !chain.kernelFactoryAddress ||
      !chain.kernelImplAddress ||
      !chain.passkeyValidatorAddress ||
      !chain.entryPointAddress
    ) {
      throw new Error(
        `Chain ${chainId} (${chain.name}) is missing required contract addresses. ` +
          `Complete the pre-implementation verification checklist before provisioning wallets.`,
      );
    }

    return {
      chainId: chain.chainId,
      kernelFactoryAddress: chain.kernelFactoryAddress as `0x${string}`,
      kernelImplAddress: chain.kernelImplAddress as `0x${string}`,
      passkeyValidatorAddress: chain.passkeyValidatorAddress as `0x${string}`,
      entryPointAddress: chain.entryPointAddress as `0x${string}`,
    };
  }

  /**
   * Seed the supported chains table with initial chain data.
   * Only used during initial setup — chains are updated manually after
   * on-chain verification (cast code, eth_call for RIP-7212, ZeroDev registry).
   */
  async seedChains(): Promise<void> {
    const chains = [
      {
        chainId: 42220,
        name: 'Celo Mainnet',
        rpcUrl: process.env.CELO_RPC ?? '',
        explorerUrl: 'https://celoscan.io',
        nickFactoryVerified: true, // Verified: 69 bytes at 0x4e59b44847b379578588920ca78fbf26c0b4956c
        rip7212Verified: true,     // Verified: eth_call responsive at 0x100
        isActive: false,           // Activate after Kernel impl + validator addresses confirmed
        isTestnet: false,
      },
      {
        chainId: 84532,
        name: 'Base Sepolia',
        rpcUrl: process.env.BASE_SEPOLIA_RPC ?? '',
        explorerUrl: 'https://sepolia.basescan.org',
        nickFactoryVerified: false, // ⚠️ Connection timeout — run: cast code 0x4e59b...956c --rpc-url <base-sepolia>
        rip7212Verified: true,      // Verified: eth_call responsive at 0x100
        isActive: false,
        isTestnet: true,
      },
      {
        chainId: 4202,
        name: 'Lisk Sepolia',
        rpcUrl: process.env.LISK_SEPOLIA_RPC ?? '',
        explorerUrl: 'https://sepolia-blockscout.lisk.com',
        nickFactoryVerified: true, // Verified: 69 bytes
        rip7212Verified: true,     // Verified: eth_call responsive at 0x100
        isActive: false,
        isTestnet: true,
      },
      {
        chainId: 11142220,
        name: 'Celo Sepolia',
        rpcUrl: process.env.CELO_SEPOLIA_RPC ?? '',
        explorerUrl: 'https://alfajores.celoscan.io',
        nickFactoryVerified: false, // ⚠️ DNS failure during verification — needs manual check
        rip7212Verified: false,     // Assumed same as Celo mainnet — needs verification
        isActive: false,
        isTestnet: true,
      },
    ];

    for (const chain of chains) {
      await this.db
        .insert(supportedChains)
        .values(chain)
        .onConflictDoNothing();
    }

    this.logger.log(`Seeded ${chains.length} chains into supported_chains.`);
  }
}
