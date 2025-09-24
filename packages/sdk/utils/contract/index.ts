/**
 * 4lph4Verse SDK — Contract Helpers
 *
 * Provides safe access to deployed contract addresses + ABIs
 * across networks (chainIds).
 */

import { deployedContracts, chainNames, DeployedContracts } from "./deployedContracts";

export type ContractInfo = {
  readonly address: `0x${string}`;
  readonly abi: readonly unknown[];
  readonly deployedOnBlock: number;
};

export type ChainId = keyof DeployedContracts; // "11142220" | "31337" | ...
export type ContractName<C extends ChainId> = keyof DeployedContracts[C];

/**
 * Get all contracts deployed on a given chainId.
 */
export function getContracts<C extends ChainId>(chainId: C): Record<string, ContractInfo> {
  return deployedContracts[chainId] as unknown as Record<string, ContractInfo>;
}

/**
 * Get a specific contract’s address + ABI by chainId + name.
 */
export function getContract<C extends ChainId, N extends ContractName<C>>(
  chainId: C,
  name: N
): ContractInfo {
  return deployedContracts[chainId][name] as unknown as ContractInfo;
}

/**
 * Quick helpers
 */
export function getAddress<C extends ChainId, N extends ContractName<C>>(
  chainId: C,
  name: N
): `0x${string}` {
  return getContract(chainId, name).address;
}

export function getAbi<C extends ChainId, N extends ContractName<C>>(
  chainId: C,
  name: N
): readonly unknown[] {
  return getContract(chainId, name).abi;
}

/**
 * Resolve human-readable chain name from id.
 */
export function getChainName(chainId: number | string) {
  const key = Number(chainId) as unknown as keyof typeof chainNames;
  return chainNames[key] ?? `chain-${chainId}`;
}

