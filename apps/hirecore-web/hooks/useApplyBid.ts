"use client";

import { useState } from "react";
import { useWriteContract, useConfig, useChainId } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { getDeployedContract } from "@verse/sdk/utils/contract/deployedContracts";
import type { ChainId } from "@verse/sdk/utils/contract/deployedContracts";
import { HIRECORE_CHAIN } from "@verse/sdk";

export function useApplyBid(taskId: number) {
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const chainId = useChainId() as ChainId;

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyToTask = async (message: string) => {
    try {
      setLoading(true);
      const contract = getDeployedContract(HIRECORE_CHAIN, "HireCoreJobBoard");

      const tx = await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "applyNow",
        args: [taskId, message],
      });

      setTxHash(tx);
      await waitForTransactionReceipt(config, { hash: tx, confirmations: 1 });
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.shortMessage || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const placeBid = async (amount: number, message: string, estimatedTime: string) => {
    try {
      setLoading(true);
      const contract = getDeployedContract(HIRECORE_CHAIN, "HireCoreJobBoard");

      const tx = await writeContractAsync({
        address: contract.address,
        abi: contract.abi,
        functionName: "placeBid",
        args: [taskId, BigInt(amount), message],
      });

      setTxHash(tx);
      await waitForTransactionReceipt(config, { hash: tx, confirmations: 1 });
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.shortMessage || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { applyToTask, placeBid, loading, txHash, error };
}
