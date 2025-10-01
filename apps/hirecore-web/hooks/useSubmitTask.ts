"use client";

import { useState } from "react";
import { useWriteContract, useChainId } from "wagmi";
import { ChainId, getDeployedContract } from "@verse/sdk/utils/contract/deployedContracts";
import type { TaskFormData, TaskPayload } from "@verse/hirecore-web/utils/Interfaces";

// 🚨 stub: replace with a real IPFS client (e.g. web3.storage, pinata, nft.storage, etc.)
async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  // For demo: fake CID (replace with actual upload)
  const fakeCid = Math.random().toString(36).substring(2);
  return `ipfs://${fakeCid}`;
}

export function useSubmitTask() {
  const chainId = useChainId() as ChainId;
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);

  async function submitTask(formData: TaskPayload) {
    try {
      setLoading(true);

      // 1. build metadata JSON
      const metadata = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        serviceType: formData.serviceType,
        location: formData.location,
        coordinates: formData.coordinates,
        skills: formData.skills,
        attachments: formData.attachments,
        budget: formData.budget,
        timeEstimate: formData.timeEstimate,
      };

      // 2. upload metadata to IPFS
      const metadataURI = await uploadMetadataToIPFS(metadata);

      // 3. resolve contract
      const jobBoard = getDeployedContract(chainId, "HireCoreJobBoard");
      if (!jobBoard?.address) {
        throw new Error("JobBoard contract not found for this chain");
      }

      // 4. call createPost
      await writeContractAsync({
        abi: jobBoard.abi,
        address: jobBoard.address,
        functionName: "createPost",
        args: [
          formData.paymentToken,
          BigInt(formData.budget),   // budgetMax
          BigInt(formData.duration??0), // expiry duration in seconds
          metadataURI,
        ],
      });
    } finally {
      setLoading(false);
    }
  }

  return { submitTask, loading };
}
