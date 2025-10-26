import { ChainId, deployedContracts } from "@verse/sdk";

const chainId = Number(process.env.CHAIN_ID || 11142220) as ChainId;

export const permitTypedData = {
  domain: {
    name: "Alph4 Core",
    version: "1",
    chainId,
    verifyingContract: deployedContracts[chainId].CoreToken.address
  },
  types: {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ]
  }
};
