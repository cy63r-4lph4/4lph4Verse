/**
 * 4lph4Verse SDK — Contract Helpers
 *
 * Provides safe access to deployed contract addresses + ABIs
 * across networks (chainIds).
 */

import { deployedContracts, chainNames, DeployedContracts } from "./deployedContracts";

export type ContractName<C extends number> = keyof DeployedContracts[C];
export type ChainId = keyof typeof deployedContracts;

/**
 * Get all contracts deployed on a given chainId.
 */
export function getContracts<C extends ChainId>(chainId: C) {
  return deployedContracts[chainId];
}

/**
 * Get a specific contract’s address + ABI by chainId + name.
 * Throws if not found.
 */
export function getContract<C extends ChainId, N extends ContractName<C>>(
  chainId: C,
  name: N
): DeployedContracts[C][N] {
  const contracts = deployedContracts[chainId];
  if (!contracts) {
    throw new Error(`❌ No contracts for chainId ${chainId} (${chainNames[chainId] ?? "unknown"})`);
  }
  const contract = contracts[name];
  if (!contract) {
    throw new Error(`❌ Contract ${String(name)} not deployed on chain ${chainId}`);
  }
  return contract;
}

/**
 * Quick helpers: address only.
 */
export function getAddress<C extends ChainId, N extends ContractName<C>>(chainId: C, name: N) {
  return getContract(chainId, name).address;
}

export function getAbi<C extends ChainId, N extends ContractName<C>>(chainId: C, name: N) {
  return getContract(chainId, name).abi;
}

/**
 * Resolve human-readable chain name from id.
 */
export function getChainName(chainId: number) {
  return chainNames[chainId as keyof typeof chainNames] ?? `chain-${chainId}`;
}
