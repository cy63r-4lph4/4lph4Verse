"use client";

import { useAccount, useReadContract, useChainId } from "wagmi";
import {
  ChainId,
  getDeployedContract,
} from "../utils/contract/deployedContracts"; 

type UseCheckProfileResult = {
  hasProfile: boolean;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
};

export function useCheckProfile(): UseCheckProfileResult {
  const { address } = useAccount();
  const chainId = useChainId() as ChainId;

  const contract = getDeployedContract(chainId, "VerseProfile");
  const enabled = Boolean(address && contract?.address);

  const { data, isLoading, error, refetch } = useReadContract({
    abi: contract.abi,
    address: contract.address,
    functionName: "hasProfile",
    args: address ? [address] : undefined,
    query: {
      enabled,
      refetchOnWindowFocus: false,
    },
  });

  return {
    hasProfile: Boolean(data),
    isLoading,
    error,
    refetch,
  };
}
