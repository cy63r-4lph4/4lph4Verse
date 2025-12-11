import { type ChainId, getDeployedContract } from "@verse/sdk/utils/contract/deployedContracts";

export function buildPermitTypedData(chainId: ChainId) {
  if (chainId == 42220) {
    return "invalid chainId";
  }
  const CoreToken = getDeployedContract(chainId, "CoreToken");

  return {
    domain: {
      name: "Alph4 Core",
      version: "1",
      chainId,
      verifyingContract: CoreToken.address,
    },
    types: {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    },
  };
}
