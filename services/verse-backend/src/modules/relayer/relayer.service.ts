import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
  LocalAccount,
  Hash,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { localhost } from 'viem/chains';

@Injectable()
export class RelayerService implements OnModuleInit {
  private readonly logger = new Logger(RelayerService.name);
  private publicClient: PublicClient;
  private walletClient: WalletClient;
  private account: LocalAccount;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const rpcUrl = this.configService.get<string>('RPC_URL', 'http://127.0.0.1:8545');
    const privateKey = this.configService.get<string>('RELAYER_PRIVATE_KEY');

    if (!privateKey) {
      throw new Error('RELAYER_PRIVATE_KEY is not defined in .env');
    }

    // Ensure it starts with 0x
    const formattedKey = privateKey.startsWith('0x')
      ? (privateKey as `0x${string}`)
      : (`0x${privateKey}` as `0x${string}`);

    this.account = privateKeyToAccount(formattedKey);

    const transport = http(rpcUrl);
    
    // For local dev, we default to localhost chain. You may make this configurable later.
    this.publicClient = createPublicClient({
      chain: localhost,
      transport,
    });

    this.walletClient = createWalletClient({
      account: this.account,
      chain: localhost,
      transport,
    });

    this.logger.log(`RelayerService initialized with account: ${this.account.address}`);
  }

  /**
   * Relay a transaction to the network using the backend's funded relayer account.
   */
  async sendTransaction(params: {
    to: `0x${string}`;
    data?: `0x${string}`;
    value?: bigint;
  }): Promise<{ hash: Hash; status: 'success' | 'reverted' }> {
    try {
      this.logger.debug(`Relaying tx to ${params.to}`);
      
      const hash = await this.walletClient.sendTransaction({
        account: this.account,
        to: params.to,
        data: params.data,
        value: params.value,
        chain: localhost,
      });

      this.logger.debug(`Tx submitted: ${hash}. Waiting for receipt...`);
      
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      
      this.logger.debug(`Tx receipt status: ${receipt.status}`);
      
      return { hash, status: receipt.status };
    } catch (error) {
      this.logger.error(`Failed to relay transaction: ${error.message}`, error.stack);
      throw error;
    }
  }

  get address(): `0x${string}` {
    return this.account.address;
  }

  get client(): PublicClient {
    return this.publicClient;
  }
}
