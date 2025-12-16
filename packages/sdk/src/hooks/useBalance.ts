"use client";

import { useAccount, useChainId, useReadContracts } from "wagmi";
import type { Abi } from "viem";
import { TokenUtils } from "@verse/sdk/utils/token/tokenUtils";
import {
  getDeployedContract,
  type ChainId,
} from "@verse/sdk/utils/contract/deployedContracts";
import { getChains } from "@verse/sdk/config/chainConfig";

type BalanceMap = Record<number, string>;
type ReadContract = {
  chainId: ChainId;
  abi: Abi;
  address: `0x${string}`;
  functionName: "balanceOf";
  args: readonly [`0x${string}`];
};

export function useBalance(): {
  balances: BalanceMap;
  totalBalance: string;
  isLoading: boolean;
  refetch: () => void;
} {
  const { address } = useAccount();
  const currentChainId = useChainId() as ChainId;
  const chains = getChains() as ChainId[];

  const contracts = chains
    .filter((chainId) => chainId !== 42220)
    .map((chainId): ReadContract | null => {
      if (!address) return null;

      const contract = getDeployedContract(chainId, "CoreToken");
      if (!contract) return null;

      return {
        chainId,
        abi: contract.abi as Abi,
        address: contract.address as `0x${string}`,
        functionName: "balanceOf",
        args: [address] as const,
      };
    })
    .filter((c): c is ReadContract => c !== null);


  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: Boolean(address && contracts.length),
    },
  });

  const balances: BalanceMap = {};
  let total = 0n;
  
  
  data?.forEach((result, index) => {
    if (result?.status !== "success") return;

    const chainId = contracts[index]!.chainId;
    const value = result.result as bigint;
    balances[chainId] = TokenUtils.compact(value, 18);
    total += value;
  });

  return {
    balances,
    totalBalance: TokenUtils.compact(total, 18),
    isLoading,
    refetch,
  };
}
