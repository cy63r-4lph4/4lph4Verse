"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import type { Abi } from "viem";
import { TokenUtils } from "../utils/token/tokenUtils";
import {
  ChainId,
  getDeployedContract,
} from "../utils/contract/deployedContracts"; 

export function useBalance(): {
  balance: string;
  isLoading: boolean;
  refetch: () => void;
} {
  const { address } = useAccount();
  const chainId = useChainId() as ChainId | undefined;
  const contractName = "CoreToken";

  const contract = chainId ? getDeployedContract(chainId, contractName) : undefined;

  const { data, isLoading, refetch } = useReadContract({
    abi: contract?.abi as Abi,
    address: contract?.address as `0x${string}`,
    functionName: "balanceOf",
    args: address && contract?.address ? [address] : undefined,
    query: {
      enabled: Boolean(address && contract?.address),
    },
  });

  const balance = data ? TokenUtils.compact(data as bigint, 18) : "0.00";

  return {
    balance,
    isLoading,
    refetch: refetch ?? (() => {}), 
  };
}
