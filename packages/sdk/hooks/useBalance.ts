"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import type { Abi } from "viem";
import { deployedContracts } from "../utils/contract/deployedContracts";
import { TokenUtils } from "../utils/token/tokenUtils";

/**
 * useBalance
 * Fetches the balance of a deployed contract token (ERC20).
 */
export function useBalance(): {
  balance: string;
  isLoading: boolean;
  refetch: () => void;
} {
  const { address } = useAccount();
  const chainId = useChainId();
  const contractName = "CoreToken";

  const contract = (deployedContracts as Record<string, any>)[chainId]?.[contractName];

  const { data, isLoading, refetch } = useReadContract({
    abi: contract?.abi as Abi,
    address: contract?.address as `0x${string}`,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && contract?.address),
    },
  });

  const balance = data
    ? TokenUtils.compact(data as bigint, 18) // format your balance
    : "0.00";

  return {
    balance,
    isLoading,
    refetch: refetch as () => void, // cast to a simple callable
  };
}
