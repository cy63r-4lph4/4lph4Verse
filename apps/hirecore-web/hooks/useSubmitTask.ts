"use client";

import { useState } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";
import { config } from "@verse/providers";
import {
  ChainId,
  getDeployedContract,
} from "@verse/sdk/utils/contract/deployedContracts";
import type { TaskPayload } from "@verse/hirecore-web/utils/Interfaces";
import { uploadFileToPinata, uploadJsonToPinata } from "@verse/services/pinata";
import { TokenUtils } from "@verse/sdk";
import { signTypedData, waitForTransactionReceipt } from "wagmi/actions";
import { encodeFunctionData } from "viem";

type PostStage =
  | "idle"
  | "checking_profile"
  | "checking_allowance"
  | "uploading_attachments"
  | "uploading_metadata"
  | "approving_deposit"
  | "relaying"
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

  // Deployed contracts
  const jobBoard = getDeployedContract(chainId, "HireCoreJobBoard");
  const coreTokenContract = getDeployedContract(chainId, "CoreToken");

  // On-chain reads
  const { data: minDepositData } = useReadContract({
    abi: jobBoard.abi,
    address: jobBoard.address,
    functionName: "minDeposit",
  });

  const { data: allowanceData } = useReadContract({
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

      /* ----------------- 3️⃣ Ensure allowance ----------------- */
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

        if (allowance > 0n) {
          const resetHash = await writeContractAsync({
            abi: coreTokenContract.abi,
            address: coreTokenContract.address,
            functionName: "approve",
            args: [jobBoard.address, 0n],
          });

          await waitForTransactionReceipt(config, {
            hash: resetHash,
            confirmations: 1,
          });
        }

        const approveHash = await writeContractAsync({
          abi: coreTokenContract.abi,
          address: coreTokenContract.address,
          functionName: "approve",
          args: [jobBoard.address, required],
        });

        await waitForTransactionReceipt(config, {
          hash: approveHash,
          confirmations: 1,
        });
      }

      /* ----------------- 4️⃣ Sign Task Intent ----------------- */
      setStatus({
        stage: "relaying",
        message: "Preparing and signing task intent…",
      });


const encodedArgs = encodeFunctionData({
  abi: jobBoard.abi,
  functionName: "createPost",
  args: [
    coreTokenContract.address,
    TokenUtils.parse(formData.budget ?? "0", 18),
    BigInt(formData.duration ?? 0),
    metadataURI,
  ],
});

const data = {
  to: jobBoard.address as `0x${string}`,
  functionName: "createPost",
  args: encodedArgs, 
};

      const signature = await signTypedData(config, {
        account: address,
        domain: {
          name: "HireCoreJobBoard",
          version: "1.0",
          chainId,
          verifyingContract: jobBoard.address,
        },
        types: {
          TaskIntent: [
            { name: "to", type: "address" },
            { name: "functionName", type: "string" },
            { name: "args", type: "bytes" },
          ],
        },
        primaryType: "TaskIntent",
        message: data,
      });

      /* ----------------- 5️⃣ Relay through API ----------------- */
      const response = await fetch("/api/relay/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          signature,
          chainId,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Relay failed");
      }

      setStatus({ stage: "done", message: "🎉 Task relayed successfully!" });
      return result.txHash;
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
