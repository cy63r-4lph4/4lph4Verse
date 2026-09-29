import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { celo, celoSepolia, baseSepolia } from 'viem/chains';

/**
 * BundlerService — ERC-4337 UserOperation relay layer.
 *
 * Responsibilities:
 *   1. Read the ERC-4337 nonce for an account from the EntryPoint contract.
 *   2. Submit a signed UserOperation to the bundler RPC (via eth_sendUserOperation).
 *
 * Security model:
 *   - This service NEVER handles private keys or seeds.
 *   - Signing is done client-side inside the browser's Secure Enclave via WebAuthn.
 *   - This service only validates the UserOp format and forwards it to the bundler.
 *
 * The bundler (e.g., Pimlico, Stackup, or Alto) validates:
 *   - Simulation: the UserOp must not revert during simulation
 *   - Signature: the on-chain WebAuthn P256 validator verifies the Passkey signature
 *   - Gas: the account must have enough balance or a valid Paymaster
 */
@Injectable()
export class BundlerService {
  private readonly logger = new Logger(BundlerService.name);

  // ERC-4337 EntryPoint v0.7 — same address on all supported chains
  private readonly ENTRYPOINT = '0x0000000071727De22E5E9d8BAf0edAc6f37da032' as const;

  // Chain ID → public viem client + bundler RPC URL
  private readonly chainClients = new Map<number, any>();
  private readonly bundlerUrls = new Map<number, string>();

  constructor(private configService: ConfigService) {
    this.initChains();
  }

  private initChains() {
    const chains = [
      {
        chain: celo,
        rpc: this.configService.get('CELO_RPC_URL', 'https://forno.celo.org'),
        bundler: this.configService.get('CELO_BUNDLER_URL', 'https://api.pimlico.io/v2/celo/rpc'),
      },
      {
        chain: celoSepolia,
        rpc: this.configService.get('CELO_SEPOLIA_RPC_URL', 'https://alfajores-forno.celo-testnet.org'),
        bundler: this.configService.get('CELO_SEPOLIA_BUNDLER_URL', 'https://api.pimlico.io/v2/celo-alfajores/rpc'),
      },
      {
        chain: baseSepolia,
        rpc: this.configService.get('BASE_SEPOLIA_RPC_URL', 'https://sepolia.base.org'),
        bundler: this.configService.get('BASE_SEPOLIA_BUNDLER_URL', 'https://api.pimlico.io/v2/base-sepolia/rpc'),
      },
    ];

    for (const { chain, rpc, bundler } of chains) {
      this.chainClients.set(
        chain.id,
        createPublicClient({ chain, transport: http(rpc) }),
      );
      this.bundlerUrls.set(chain.id, bundler);
    }

    this.logger.log(`BundlerService initialized for chains: ${[...this.chainClients.keys()].join(', ')}`);
  }

  /**
   * Returns the ERC-4337 nonce for an account from the EntryPoint.
   * The nonce is a 256-bit value: upper 192 bits = key, lower 64 bits = sequential.
   * For the default key (0), this is equivalent to the simple sequential nonce.
   */
  async getNonce(address: `0x${string}`, chainId: number): Promise<bigint> {
    const client = this.chainClients.get(chainId);
    if (!client) {
      this.logger.warn(`No client for chainId ${chainId}, returning nonce 0`);
      return 0n;
    }

    try {
      const nonce = await client.readContract({
        address: this.ENTRYPOINT,
        abi: [parseAbiItem('function getNonce(address sender, uint192 key) external view returns (uint256 nonce)')],
        functionName: 'getNonce',
        args: [address, 0n],
      });

      this.logger.debug(`Nonce for ${address} on chain ${chainId}: ${nonce}`);
      return nonce as bigint;
    } catch (err) {
      this.logger.error(`Failed to get nonce for ${address} on chain ${chainId}: ${err.message}`);
      return 0n;
    }
  }

  /**
   * Submits a signed UserOperation to the bundler via eth_sendUserOperation.
   *
   * The bundler will:
   *  1. Simulate the UserOp against the EntryPoint
   *  2. Verify the P-256 WebAuthn signature via the on-chain validator
   *  3. Bundle and submit to the network
   *
   * Returns the UserOp hash (not the transaction hash).
   * The transaction hash is available once the bundler mines the bundle.
   */
  async sendUserOperation(
    userOp: Record<string, any>,
    chainId: number,
  ): Promise<string> {
    const bundlerUrl = this.bundlerUrls.get(chainId);

    if (!bundlerUrl) {
      throw new Error(`No bundler configured for chainId ${chainId}`);
    }

    this.logger.log(`Submitting UserOp for ${userOp.sender} on chain ${chainId}`);

    const res = await fetch(bundlerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_sendUserOperation',
        params: [userOp, this.ENTRYPOINT],
      }),
    });

    const json = await res.json() as { result?: string; error?: { message: string } };

    if (json.error) {
      this.logger.error(`Bundler error: ${json.error.message}`);
      throw new Error(`Bundler rejected UserOp: ${json.error.message}`);
    }

    const userOpHash = json.result!;
    this.logger.log(`UserOp submitted: ${userOpHash}`);
    return userOpHash;
  }
}
