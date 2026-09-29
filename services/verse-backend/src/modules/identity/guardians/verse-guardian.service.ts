import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../db/schema';
import { eq, and, desc } from 'drizzle-orm';

import { buildGuardianSignaturePayload, GUARDIAN_ACTIONS } from '@verse/sdk';
import { RelayerService } from '../../relayer/relayer.service';
import { parseAbiItem, encodeFunctionData, PublicClient } from 'viem';

// Provide appropriate ABI/Address based on env/constants in your app. 
// For now we'll define a minimal ABI for GuardianRecoveryModule.
const guardianRecoveryAbi = [
  parseAbiItem('function initiateRecovery(uint256 verseId, address newOwner, bytes[] calldata signatures) external'),
  parseAbiItem('function executeRecovery(uint256 verseId, address newOwner, bytes[] calldata signatures) external'),
  parseAbiItem('function cancelRecovery(uint256 verseId, address pendingOwner, bytes[] calldata signatures) external'),
  parseAbiItem('function hardFreeze(uint256 verseId, bytes[] calldata signatures) external'),
  parseAbiItem('function unfreeze(uint256 verseId, bytes[] calldata signatures) external'),
];

// Mock addresses, replace with config
const GUARDIAN_RECOVERY_ADDRESS = '0x1234567890123456789012345678901234567890';
const PROOF_OF_OWNER_ADDRESS = '0x2345678901234567890123456789012345678901';

@Injectable()
export class VerseGuardianService implements OnModuleInit {
  private readonly logger = new Logger(VerseGuardianService.name);

  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
    private readonly relayer: RelayerService
  ) {}

  onModuleInit() {
    this.listenForHumanVerified();
  }

  private async listenForHumanVerified() {
    this.logger.log('Listening for HumanVerified events...');
    // We assume the RelayerService provides access to a publicClient or we instantiate one here.
    // For simplicity, we just log since we don't have direct access to publicClient from RelayerService in this snippet,
    // or we can just mock the listener.
    // In a real implementation, you'd use publicClient.watchEvent({...})
  }

  async getGuardianEpoch(verseId: string): Promise<bigint> {
    const activeGuardians = await this.db
      .select({ epoch: schema.verseGuardians.epoch })
      .from(schema.verseGuardians)
      .where(and(eq(schema.verseGuardians.verseId, verseId), eq(schema.verseGuardians.status, 'active')))
      .orderBy(desc(schema.verseGuardians.epoch))
      .limit(1);
    
    return activeGuardians.length > 0 ? BigInt(activeGuardians[0].epoch) : 0n;
  }

  async getCurrentRecoveryNonce(verseId: string): Promise<bigint> {
    const activeRequest = await this.db
      .select({ nonce: schema.verseRecoveryRequests.nonce })
      .from(schema.verseRecoveryRequests)
      .where(and(eq(schema.verseRecoveryRequests.verseId, verseId), eq(schema.verseRecoveryRequests.active, true)))
      .orderBy(desc(schema.verseRecoveryRequests.createdAt))
      .limit(1);

    return activeRequest.length > 0 && activeRequest[0].nonce 
      ? BigInt(activeRequest[0].nonce) 
      : 0n;
  }

  async getNextRecoveryNonce(verseId: string): Promise<bigint> {
    const latestRequest = await this.db
      .select({ nonce: schema.verseRecoveryRequests.nonce })
      .from(schema.verseRecoveryRequests)
      .where(eq(schema.verseRecoveryRequests.verseId, verseId))
      .orderBy(desc(schema.verseRecoveryRequests.createdAt))
      .limit(1);
      
    const currentNonce = latestRequest.length > 0 && latestRequest[0].nonce 
      ? BigInt(latestRequest[0].nonce) 
      : 0n;
      
    return currentNonce + 1n;
  }

  async getPendingNewOwner(verseId: string): Promise<`0x${string}` | null> {
    const activeRequest = await this.db
      .select({ pendingNewOwner: schema.verseRecoveryRequests.pendingNewOwner })
      .from(schema.verseRecoveryRequests)
      .where(and(eq(schema.verseRecoveryRequests.verseId, verseId), eq(schema.verseRecoveryRequests.active, true)))
      .orderBy(desc(schema.verseRecoveryRequests.createdAt))
      .limit(1);
      
    return activeRequest.length > 0 ? activeRequest[0].pendingNewOwner as `0x${string}` : null;
  }

  async buildGuardianPayload(
    verseId: string, 
    actionName: keyof typeof GUARDIAN_ACTIONS,
    paramsHash: `0x${string}`,
    recoveryNonce: bigint,
    deadline: bigint,
    domain: any
  ) {
    const action = GUARDIAN_ACTIONS[actionName];
    const guardianEpoch = await this.getGuardianEpoch(verseId);

    const message = {
      verseId: BigInt(verseId),
      action,
      paramsHash,
      guardianEpoch,
      recoveryNonce,
      deadline,
    };

    return buildGuardianSignaturePayload(domain, message);
  }

  async relayAction(
    verseId: string,
    actionType: string,
    signatures: `0x${string}`[],
    newOwner?: `0x${string}`
  ) {
    let data: `0x${string}`;

    switch (actionType) {
      case 'RECOVERY_INIT':
        if (!newOwner) throw new Error('newOwner is required for RECOVERY_INIT');
        data = encodeFunctionData({
          abi: guardianRecoveryAbi,
          functionName: 'initiateRecovery',
          args: [BigInt(verseId), newOwner, signatures],
        });
        break;
      case 'RECOVERY_EXECUTE':
        if (!newOwner) throw new Error('newOwner is required for RECOVERY_EXECUTE');
        data = encodeFunctionData({
          abi: guardianRecoveryAbi,
          functionName: 'executeRecovery',
          args: [BigInt(verseId), newOwner, signatures],
        });
        break;
      case 'RECOVERY_CANCEL':
        if (!newOwner) throw new Error('pendingOwner is required for RECOVERY_CANCEL');
        data = encodeFunctionData({
          abi: guardianRecoveryAbi,
          functionName: 'cancelRecovery',
          args: [BigInt(verseId), newOwner, signatures],
        });
        break;
      case 'HARD_FREEZE':
        data = encodeFunctionData({
          abi: guardianRecoveryAbi,
          functionName: 'hardFreeze',
          args: [BigInt(verseId), signatures],
        });
        break;
      case 'UNFREEZE':
        data = encodeFunctionData({
          abi: guardianRecoveryAbi,
          functionName: 'unfreeze',
          args: [BigInt(verseId), signatures],
        });
        break;
      default:
        throw new Error(`Unsupported action type: ${actionType}`);
    }

    const receipt = await this.relayer.sendTransaction({
      to: GUARDIAN_RECOVERY_ADDRESS,
      data,
    });

    this.logger.log(`Action ${actionType} relayed for verseId ${verseId}. Hash: ${receipt.hash}`);
    return receipt;
  }
}
