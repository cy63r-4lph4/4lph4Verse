
export const permitTypedData = {
  domain: {
    name: "CoreToken",
    version: "1",
    chainId: 44787, 
    verifyingContract: process.env.CORE_TOKEN
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
