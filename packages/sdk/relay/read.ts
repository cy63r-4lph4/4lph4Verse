import { getPublicClient } from "./client";
import { getDeployedContract,ChainId } from "../utils/contract/deployedContracts";
import { fetchFromPinata } from "@verse/services/pinata/fetchFromPinata";
import { TokenUtils } from "../utils/token/tokenUtils";

export async function fetchTasks(chainId: number, filters?: any) {
  const client = getPublicClient(chainId);
  const jobBoard = getDeployedContract(chainId as ChainId, "HireCoreJobBoard");

  const postCount = (await client.readContract({
    ...jobBoard,
    functionName: "nextPostId",
  })) as bigint;

  const totalPosts = Number(postCount) - 1;
  if (totalPosts <= 0) return [];

  const posts = await Promise.all(
    Array.from({ length: totalPosts }, (_, i) => i + 1).map(async (id) => {
      const res = (await client.readContract({
        ...jobBoard,
        functionName: "posts",
        args: [BigInt(id)],
      })) as any[];

      const [hirer, , budgetMax, expiry, deposit, metadataURI, open] = res;
      if (!open) return null;

      let metadata;
      try {
        metadata = await fetchFromPinata(metadataURI);
      } catch {
        metadata = { title: `Task #${id}`, description: "Metadata unavailable" };
      }

      return {
        id,
        hirer,
        budget: Number(TokenUtils.format(budgetMax, 18)),
        deposit: Number(TokenUtils.format(deposit, 18)),
        expiry: Number(expiry),
        metadata,
      };
    })
  );

  return posts.filter(Boolean);
}
