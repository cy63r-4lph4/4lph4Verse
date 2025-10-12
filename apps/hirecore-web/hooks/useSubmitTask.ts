"use client";

import { useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { config } from "@verse/providers";
import {
  ChainId,
  getDeployedContract,
} from "@verse/sdk/utils/contract/deployedContracts";
import type { TaskPayload } from "@verse/hirecore-web/utils/Interfaces";
import { uploadFileToPinata, uploadJsonToPinata } from "@verse/services/pinata";

/* --------------------------------------------------
 * Retry-safe receipt waiter for Celo / slow RPCs
 * -------------------------------------------------- */
export async function waitForTxReceiptSafe(
  hash: `0x${string}`,
  { retries = 15, delayMs = 3000 }: { retries?: number; delayMs?: number } = {}
) {
  for (let i = 0; i < retries; i++) {
    try {
      return await waitForTransactionReceipt(config, {
        hash,
        confirmations: 1,
        pollingInterval: delayMs,
        retryCount: 3,
      });
    } catch (err: any) {
      if (err.message?.includes("block is out of range")) {
        console.warn(
          `[waitForTxReceiptSafe] Block not indexed yet (try ${i + 1}/${retries})`
        );
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Timeout waiting for transaction receipt");
}

/* --------------------------------------------------
 * useSubmitTask Hook
 * -------------------------------------------------- */
type PostStage =
  | "idle"
  | "checking_profile"
  | "checking_allowance"
  | "uploading_attachments"
  | "uploading_metadata"
  | "approving_deposit"
  | "writing"
  | "done"
  | "error";

export function useSubmitTask() {
  const { address } = useAccount();
  const chainId = useChainId() as ChainId;
  const { writeContractAsync } = useWriteContract();

  const [status, setStatus] = useState<{ stage: PostStage; message?: string }>({
    stage: "idle",
  });
  const [loading, setLoading] = useState(false);

  // --- Deployed contracts ---
  const jobBoard = getDeployedContract(chainId, "HireCoreJobBoard");
  const coreTokenContract = getDeployedContract(chainId, "CoreToken");

  // --- On-chain reads ---
  const { data: minDepositData } = useReadContract({
    abi: jobBoard.abi,
    address: jobBoard.address,
    functionName: "minDeposit",
  });

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    abi: coreTokenContract.abi,
    address: coreTokenContract.address,
    functionName: "allowance",
    args: address ? [address, jobBoard.address] : undefined,
  });

  /* --------------------------------------------------
   * Submit Task
   * -------------------------------------------------- */
  async function submitTask(formData: TaskPayload, verseId: number) {
    try {
      if (!address) throw new Error("Connect wallet to continue");
      if (!verseId)
        throw new Error("You need a Verse profile before posting a task");

      setLoading(true);
      setStatus({
        stage: "checking_profile",
        message: "Checking your Verse profile…",
      });

      const minDeposit = BigInt((minDepositData as bigint | undefined) ?? 0n);
      const required = minDeposit;

      /* ----------------- 1️⃣ Upload attachments ----------------- */
      setStatus({
        stage: "uploading_attachments",
        message: "Uploading attachments to IPFS…",
      });

      const uploadedAttachments: string[] = [];
      for (const attachment of formData.attachments ?? []) {
        if (attachment instanceof File) {
          const { cid } = await uploadFileToPinata(
            attachment,
            "task-attachment"
          );
          uploadedAttachments.push(`ipfs://${cid}`);
        } else if (
          typeof attachment === "string" &&
          attachment.startsWith("ipfs://")
        ) {
          uploadedAttachments.push(attachment);
        }
      }

      /* ----------------- 2️⃣ Build + upload metadata ----------------- */
      setStatus({
        stage: "uploading_metadata",
        message: "Uploading task metadata to IPFS…",
      });

      const metadata = {
        verse: { verseId, address },
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        serviceType: formData.serviceType,
        location: formData.location,
        coordinates: formData.coordinates,
        skills: formData.skills,
        attachments: uploadedAttachments,
        budget: formData.budget,
        timeEstimate: formData.timeEstimate,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
      };

      const { cid: metadataCID } = await uploadJsonToPinata(metadata, "task");
      const metadataURI = `ipfs://${metadataCID}`;

      /* ----------------- 3️⃣ Approve deposit if needed ----------------- */
      setStatus({
        stage: "checking_allowance",
        message: "Checking allowance for JobBoard deposit…",
      });

      const allowance = BigInt((allowanceData as bigint | undefined) ?? 0n);
      if (allowance < required) {
        setStatus({
          stage: "approving_deposit",
          message: "Approving minimum deposit for HireCore JobBoard…",
        });

        // Reset first if nonzero (safer)
        if (allowance > 0n) {
          const resetTx = await writeContractAsync({
            abi: coreTokenContract.abi,
            address: coreTokenContract.address,
            functionName: "approve",
            args: [jobBoard.address, 0n],
          });
          await waitForTxReceiptSafe(resetTx);
        }

        const approveTx = await writeContractAsync({
          abi: coreTokenContract.abi,
          address: coreTokenContract.address,
          functionName: "approve",
          args: [jobBoard.address, required],
        });
        await waitForTxReceiptSafe(approveTx);
      }

      /* ----------------- 4️⃣ Post task on-chain ----------------- */
      setStatus({
        stage: "writing",
        message: "Creating on-chain post…",
      });

      const txHash = await writeContractAsync({
        abi: jobBoard.abi,
        address: jobBoard.address,
        functionName: "createPost",
        args: [
          coreTokenContract.address,
          BigInt(formData.budget),
          BigInt(formData.duration ?? 0), // must be seconds (1d–30d)
          metadataURI,
        ],
      });

      setStatus({
        stage: "writing",
        message: "⏳ Waiting for transaction confirmation…",
      });

      const receipt = await waitForTxReceiptSafe(txHash);
      if (receipt.status !== "success")
        throw new Error("Transaction failed on-chain");

      setStatus({ stage: "done", message: "🎉 Task posted successfully!" });
      return metadataURI;
    } catch (err: any) {
      console.error("❌ Task submission failed:", err);
      setStatus({
        stage: "error",
        message: err?.message || "Failed to post task",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { submitTask, loading, status };
}
