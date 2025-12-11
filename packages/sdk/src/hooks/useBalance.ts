"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import type { Abi } from "viem";
import { TokenUtils } from "@verse/sdk/utils/token/tokenUtils";
import {
  getDeployedContract,
  type ChainId,
} from "@verse/sdk/utils/contract/deployedContracts";
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
  const chainId = useChainId() as ChainId;
  const contractName = "CoreToken";
  if (chainId == 42220) {
    return {
      balance: "0",
      isLoading: false,
      refetch: () => {},
    };
  }

  const contract = getDeployedContract(chainId, contractName);

  const { data, isLoading, refetch } = useReadContract({
    abi: contract?.abi as Abi,
    address: contract?.address as `0x${string}`,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && contract?.address),
    },
  });

  const balance = data ? TokenUtils.compact(data as bigint, 18) : "0.00";

  return {
    balance,
    isLoading,
    refetch: refetch as () => void,
  };
}
