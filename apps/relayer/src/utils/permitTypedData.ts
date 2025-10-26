import { ChainId, getDeployedContract } from "@verse/sdk";

export function buildPermitTypedData(chainId: ChainId) {
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
