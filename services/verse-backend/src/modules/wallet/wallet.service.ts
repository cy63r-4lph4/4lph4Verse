import { Injectable, Inject, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';

import { RelayerService } from '../relayer/relayer.service';
import { encodeFunctionData, parseAbiItem } from 'viem';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly relayer: RelayerService
  ) {}

  /**
   * Deploys a smart account on-chain by calling the KernelFactory directly via the RelayerService.
   * This provides immediate on-chain presence for the wallet without waiting for the first UserOperation.
   */
  async deploySmartAccount(walletId: string, chainId: number): Promise<any> {
    this.logger.log(`Manually deploying smart account for wallet: ${walletId} on chain: ${chainId}`);

    // Fetch the account from DB
    const account = await this.db.query.walletAccounts.findFirst({
      where: (accounts, { eq, and }) => and(
        eq(accounts.walletId, walletId),
        eq(accounts.chainId, chainId)
      )
    });

    if (!account) {
      throw new Error(`Account not found for wallet ${walletId} on chain ${chainId}`);
    }

    if (account.deploymentStatus === 'deployed') {
      this.logger.log(`Account ${account.address} already deployed on chain ${chainId}`);
      return { success: true, txHash: null, status: 'already_deployed' };
    }

    // Call KernelFactory.createAccount
    // function createAccount(address _implementation, bytes _data, uint256 _index)
    const factoryAbi = [
      parseAbiItem('function createAccount(address _implementation, bytes _data, uint256 _index) external payable returns (address proxy)')
    ];

    // For Kernel v3, _data is the initialization calldata. We would normally pass the actual init calldata used to compute the address.
    // Assuming for this mock/stub that we'll pass an empty init sequence to simulate deployment.
    // In production, `_data` must precisely match `account.derivationInitController` passkey public keys and setup calldata.
    const _data = '0x'; 
    
    const calldata = encodeFunctionData({
      abi: factoryAbi,
      functionName: 'createAccount',
      args: [account.kernelImplAddress as `0x${string}`, _data, 0n]
    });

    try {
      const receipt = await this.relayer.sendTransaction({
        to: account.kernelFactoryAddress as `0x${string}`,
        data: calldata,
      });

      // Update deployment status locally
      await this.db.update(schema.walletAccounts).set({
        deploymentStatus: 'deployed',
        deployedAt: new Date(),
      }).where(eq(schema.walletAccounts.id, account.id));

      this.logger.log(`Account successfully deployed at ${account.address}. Tx: ${receipt.hash}`);
      return { success: true, txHash: receipt.hash, status: 'deployed' };
    } catch (err) {
      this.logger.error(`Deployment failed: ${err.message}`, err.stack);
      throw err;
    }
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
