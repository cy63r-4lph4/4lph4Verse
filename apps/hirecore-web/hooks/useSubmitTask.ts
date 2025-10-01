"use client";

import { useWriteContract, useChainId } from "wagmi";
import { ChainId, getDeployedContract } from "@verse/sdk/utils/contract/deployedContracts";
import type { TaskFormData } from "@verse/hirecore-web/utils/Interfaces";

// stub: replace with real IPFS client (web3.storage, pinata, etc.)
async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
  const cid = await (await fetch("https://ipfs.infura.io:5001/api/v0/add", {
    method: "POST",
    body: blob,
  })).text();

  // 🚨 this is pseudo: you’ll want to switch to your IPFS provider
  return `ipfs://${cid}`;
}

export function useSubmitTask() {
  const chainId = useChainId() as ChainId;
  const { writeContractAsync } = useWriteContract();

  async function submitTask(formData: TaskFormData) {
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

    // 2. upload metadata
    const metadataURI = await uploadMetadataToIPFS(metadata);

    // 3. get contract
    const jobBoard = getDeployedContract(chainId, "HireCoreJobBoard");
    if (!jobBoard?.address) throw new Error("JobBoard contract not found for this chain");

    // 4. call createPost
    await writeContractAsync({
      abi: jobBoard.abi,
      address: jobBoard.address,
      functionName: "createPost",
      args: [
        formData.paymentToken,
        BigInt(formData.budget),      // budgetMax
        BigInt(formData.duration),    // expiry duration in seconds
        metadataURI,
      ],
    });
  }

  return { submitTask };
}
