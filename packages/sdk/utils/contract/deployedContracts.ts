/**
 * 4lph4Verse Deployed Contracts — Auto-generated
 * Do not edit by hand.
 */

export const chainNames = {
  "31337": "localhost",
  "42220": "celo",
  "44787": "alfajores",
  "62320": "baklava",
  "11142220": "celoSepolia",
} as const;



export const deployedContracts = {
  "11142220": {
    CoreFaucet: {
      address: "0xb5d8887AB09AdB5983AACEed4e1AbB9267407823",
      abi: [
        {
          inputs: [
            {
              internalType: "contract IERC20",
              name: "core_",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amountPerClaim_",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "cooldownSeconds_",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "ECDSAInvalidSignature",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "length",
              type: "uint256",
            },
          ],
          name: "ECDSAInvalidSignatureLength",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "ECDSAInvalidSignatureS",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidShortString",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "str",
              type: "string",
            },
          ],
          name: "StringTooLong",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "oldAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "newAmount",
              type: "uint256",
            },
          ],
          name: "AmountPerClaimUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "who",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          name: "Claimed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "oldSeconds",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "newSeconds",
              type: "uint256",
            },
          ],
          name: "CooldownUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Drain",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [],
          name: "EIP712DomainChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bool",
              name: "oldPaused",
              type: "bool",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "newPaused",
              type: "bool",
            },
          ],
          name: "PausedUpdated",
          type: "event",
        },
        {
          inputs: [],
          name: "CLAIM_TYPEHASH",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "amountPerClaim",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "claim",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "nonce",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "signature",
              type: "bytes",
            },
          ],
          name: "claimWithSig",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "cooldownSeconds",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "core",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "drain",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "eip712Domain",
          outputs: [
            {
              internalType: "bytes1",
              name: "fields",
              type: "bytes1",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "version",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "chainId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "verifyingContract",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "salt",
              type: "bytes32",
            },
            {
              internalType: "uint256[]",
              name: "extensions",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "lastClaimTimestamp",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "nonces",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "newAmount",
              type: "uint256",
            },
          ],
          name: "setAmountPerClaim",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "newSeconds",
              type: "uint256",
            },
          ],
          name: "setCooldownSeconds",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bool",
              name: "newPaused",
              type: "bool",
            },
          ],
          name: "setPaused",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    CoreToken: {
      address: "0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "name_",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol_",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "initialSupply_",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "treasury_",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "feeBps_",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "feeBurns_",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "allowance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
          ],
          name: "ERC20InsufficientAllowance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
          ],
          name: "ERC20InsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address",
            },
          ],
          name: "ERC20InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "ERC20InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "ERC20InvalidSender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "ERC20InvalidSpender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "oldBps",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "newBps",
              type: "uint256",
            },
          ],
          name: "FeeBpsUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bool",
              name: "oldMode",
              type: "bool",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "newMode",
              type: "bool",
            },
          ],
          name: "FeeBurnModeUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "exempt",
              type: "bool",
            },
          ],
          name: "FeeExemptUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "oldTreasury",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "TreasuryUpdated",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "feeBps",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "feeBurns",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "isFeeExempt",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "newBps",
              type: "uint256",
            },
          ],
          name: "setFeeBps",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bool",
              name: "newMode",
              type: "bool",
            },
          ],
          name: "setFeeBurnMode",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bool",
              name: "exempt",
              type: "bool",
            },
          ],
          name: "setFeeExempt",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "setTreasury",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "treasury",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreJobBoardImpl: {
      address: "0x47Ee34e86Bf00CaC60f0E4A74cf135a07bF9D8a8",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "AddressInsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "ReentrancyGuardReentrantCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "SafeERC20FailedOperation",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "ApplicationAccepted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "worker",
              type: "address",
            },
          ],
          name: "ApplicationWithdrawn",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "bid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
          ],
          name: "Applied",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
          ],
          name: "PostClosed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "budgetMax",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint64",
              name: "expiry",
              type: "uint64",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "deposit",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
          ],
          name: "PostCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "PostDepositSlashed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
          ],
          name: "PostExpired",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "postId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "appIndex",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "worker",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "paymentToken",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "deadline",
                  type: "uint64",
                },
                {
                  internalType: "string",
                  name: "metadataURI",
                  type: "string",
                },
                {
                  internalType: "enum IJobManager.JobType",
                  name: "jobType",
                  type: "uint8",
                },
                {
                  internalType: "uint256[]",
                  name: "amounts",
                  type: "uint256[]",
                },
                {
                  internalType: "uint64[]",
                  name: "dueDates",
                  type: "uint64[]",
                },
                {
                  internalType: "bool[]",
                  name: "requiresDeliverable",
                  type: "bool[]",
                },
              ],
              internalType: "struct HireCoreJobBoard.AcceptParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "accept",
          outputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "applications",
          outputs: [
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "bidAmount",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
            {
              internalType: "bool",
              name: "withdrawn",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "bidAmount",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
          ],
          name: "applyNow",
          outputs: [
            {
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          name: "close",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "coreToken",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "budgetMax",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "duration",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
          ],
          name: "createPost",
          outputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          name: "expire",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
          ],
          name: "getApplication",
          outputs: [
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "bidAmount",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
            {
              internalType: "bool",
              name: "withdrawn",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          name: "getApplicationsCount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "jobManager_",
              type: "address",
            },
            {
              internalType: "address",
              name: "coreToken_",
              type: "address",
            },
            {
              internalType: "address",
              name: "treasury_",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "minDeposit_",
              type: "uint256",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "jobManager",
          outputs: [
            {
              internalType: "contract IJobManager",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "minDeposit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nextPostId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "posts",
          outputs: [
            {
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "budgetMax",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "expiry",
              type: "uint64",
            },
            {
              internalType: "uint256",
              name: "deposit",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "bool",
              name: "open",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newCoreToken",
              type: "address",
            },
          ],
          name: "setCoreToken",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newJobManager",
              type: "address",
            },
          ],
          name: "setJobManager",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "newDeposit",
              type: "uint256",
            },
          ],
          name: "setMinDeposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "setTreasury",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "treasury",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreJobManagerImpl: {
      address: "0xA4a56053Ec9a7f6B2c66D9Ef3098BED80BdA585C",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "AddressInsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "EnforcedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "ExpectedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "ReentrancyGuardReentrantCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "SafeERC20FailedOperation",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "badgeRegistry",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "tierBadgeIds",
              type: "uint256[]",
            },
          ],
          name: "BadgeRegistryUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint16",
              name: "baseFeeBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "workerDiscountBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "hirerDiscountBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "uint8",
              name: "minTier",
              type: "uint8",
            },
          ],
          name: "FeesUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "refund",
              type: "uint256",
            },
          ],
          name: "JobCancelled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              indexed: false,
              internalType: "enum HireCoreJobManager.JobType",
              name: "jobType",
              type: "uint8",
            },
            {
              indexed: false,
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "feeBps",
              type: "uint16",
            },
          ],
          name: "JobCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "reason",
              type: "string",
            },
          ],
          name: "JobDisputed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "fundedTotal",
              type: "uint256",
            },
          ],
          name: "JobFunded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "workerPayout",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "hirerRefund",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "feeTaken",
              type: "uint256",
            },
          ],
          name: "JobResolved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "newURI",
              type: "string",
            },
          ],
          name: "MetadataURIUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "deliverableURI",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "note",
              type: "string",
            },
          ],
          name: "MilestoneDelivered",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "netToWorker",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "feeToTreasury",
              type: "uint256",
            },
          ],
          name: "MilestoneReleased",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bool",
              name: "enabled",
              type: "bool",
            },
          ],
          name: "NativeToggle",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "hub",
              type: "address",
            },
          ],
          name: "ReputationHubSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "allowed",
              type: "bool",
            },
          ],
          name: "TokenAllowed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "TreasuryUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "verseProfile",
              type: "address",
            },
          ],
          name: "VerseProfileSet",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "RESOLVER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "bool",
              name: "allowed",
              type: "bool",
            },
          ],
          name: "allowPaymentToken",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "allowedPaymentToken",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "badgeRegistry",
          outputs: [
            {
              internalType: "contract IBadgeRegistry",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "baseFeeBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "cancelJob",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "worker",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "paymentToken",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "deadline",
                  type: "uint64",
                },
                {
                  internalType: "string",
                  name: "metadataURI",
                  type: "string",
                },
                {
                  internalType: "enum HireCoreJobManager.JobType",
                  name: "jobType",
                  type: "uint8",
                },
                {
                  internalType: "uint256[]",
                  name: "amounts",
                  type: "uint256[]",
                },
                {
                  internalType: "uint64[]",
                  name: "dueDates",
                  type: "uint64[]",
                },
                {
                  internalType: "bool[]",
                  name: "requiresDeliverable",
                  type: "bool[]",
                },
              ],
              internalType: "struct HireCoreJobManager.CreateJobParams",
              name: "p",
              type: "tuple",
            },
          ],
          name: "createJob",
          outputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "deliverableURI",
              type: "string",
            },
            {
              internalType: "string",
              name: "note",
              type: "string",
            },
          ],
          name: "deliverMilestone",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "reason",
              type: "string",
            },
          ],
          name: "disputeJob",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "fundJob",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "fundJobNative",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "fundJobWithPermit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "getJobCore",
          outputs: [
            {
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fundedAmount",
              type: "uint256",
            },
            {
              internalType: "uint16",
              name: "feeBpsAtCreation",
              type: "uint16",
            },
            {
              internalType: "enum HireCoreJobManager.JobStatus",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "enum HireCoreJobManager.JobType",
              name: "jobType",
              type: "uint8",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "deadline",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "milestonesCount",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "getMilestone",
          outputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "dueDate",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "delivered",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "released",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "requiresDeliverable",
              type: "bool",
            },
            {
              internalType: "string",
              name: "deliverableURI",
              type: "string",
            },
            {
              internalType: "string",
              name: "note",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "hirerDiscountBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "treasury_",
              type: "address",
            },
            {
              internalType: "address",
              name: "verseProfile_",
              type: "address",
            },
            {
              internalType: "address",
              name: "reputationHub_",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "baseFeeBps_",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "maxFeeBps_",
              type: "uint16",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "maxFeeBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "minTierForDiscount",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nativePaymentsEnabled",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nextJobId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
          ],
          name: "releaseMilestone",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "reputationHub",
          outputs: [
            {
              internalType: "contract IVerseReputationHub",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "workerPayout",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "hirerRefund",
              type: "uint256",
            },
          ],
          name: "resolveDispute",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "reg",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
          ],
          name: "setBadgeRegistry",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint16",
              name: "baseFeeBps_",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "workerDiscountBps_",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "hirerDiscountBps_",
              type: "uint16",
            },
            {
              internalType: "uint8",
              name: "minTier_",
              type: "uint8",
            },
          ],
          name: "setFees",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint16",
              name: "maxFeeBps_",
              type: "uint16",
            },
          ],
          name: "setMaxFeeBps",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "hub",
              type: "address",
            },
          ],
          name: "setReputationHub",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "setTreasury",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "vp",
              type: "address",
            },
          ],
          name: "setVerseProfile",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "tierBadgeIds",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bool",
              name: "enabled",
              type: "bool",
            },
          ],
          name: "toggleNative",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "treasury",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newURI",
              type: "string",
            },
          ],
          name: "updateJobMetadataURI",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "verseProfile",
          outputs: [
            {
              internalType: "contract IVerseProfile",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "workerDiscountBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreScoreModelImpl: {
      address: "0x7c52855bd68e8d3428aad3B44604C6c3Dab70a4a",
      abi: [
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "hub",
              type: "address",
            },
          ],
          name: "HubSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "completedWeight",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "cancelledPenalty",
              type: "uint256",
            },
          ],
          name: "WeightsUpdated",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "APP_ID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "cancelledPenalty",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "completedWeight",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "hub",
          outputs: [
            {
              internalType: "contract IVerseReputationHub",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "hub_",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "scoreOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "hub_",
              type: "address",
            },
          ],
          name: "setHub",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "completedWeight_",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "cancelledPenalty_",
              type: "uint256",
            },
          ],
          name: "setWeights",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    AppRegistryImpl: {
      address: "0xfd311636AF65F9f6cCa13a0a508d1988F50A2733",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "AppActiveUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "newName",
              type: "string",
            },
          ],
          name: "AppNameUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "AppRegistered",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "AppRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
          ],
          name: "AppScoreModelUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "AppUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "AppWeightUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "address",
              name: "writer",
              type: "address",
            },
          ],
          name: "AppWriterUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "allAppIds",
          outputs: [
            {
              internalType: "bytes32[]",
              name: "",
              type: "bytes32[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "appConfigOf",
          outputs: [
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "appIds",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "computeAppScore",
          outputs: [
            {
              internalType: "uint256",
              name: "rawScore",
              type: "uint256",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getApp",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "writer",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "scoreModel",
                  type: "address",
                },
                {
                  internalType: "uint16",
                  name: "weightBps",
                  type: "uint16",
                },
                {
                  internalType: "bool",
                  name: "active",
                  type: "bool",
                },
              ],
              internalType: "struct VerseAppRegistry.App",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "isActive",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "candidate",
              type: "address",
            },
          ],
          name: "isWriter",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "registerApp",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "removeApp",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "setAppActive",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "newName",
              type: "string",
            },
          ],
          name: "setAppName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
          ],
          name: "setAppScoreModel",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "setAppWeight",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
          ],
          name: "setAppWriter",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "updateApp",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    BadgeRegistryImpl: {
      address: "0x1b398652b2dA52E737f6b9276e8617EE6ac0ca70",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ERC1155InsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address",
            },
          ],
          name: "ERC1155InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "idsLength",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "valuesLength",
              type: "uint256",
            },
          ],
          name: "ERC1155InvalidArrayLength",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "ERC1155InvalidOperator",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "ERC1155InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "ERC1155InvalidSender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC1155MissingApprovalForAll",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "EnforcedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "ExpectedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "expiry",
              type: "uint256",
            },
          ],
          name: "BadgeMinted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "newExpiry",
              type: "uint256",
            },
          ],
          name: "BadgeRenewed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "BadgeRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "isSoulbound",
              type: "bool",
            },
          ],
          name: "SoulboundSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint8",
              name: "tier",
              type: "uint8",
            },
          ],
          name: "TierSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]",
            },
          ],
          name: "TransferBatch",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "TransferSingle",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "value",
              type: "string",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "URI",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "MINTER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "REVOKER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "badgeTier",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address[]",
              name: "accounts",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
          ],
          name: "balanceOfBatch",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "expiryOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "badgeIds",
              type: "uint256[]",
            },
          ],
          name: "hasAny",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "hasBadge",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "string",
              name: "baseURI",
              type: "string",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expiry",
              type: "uint256",
            },
          ],
          name: "mintBadge",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "newExpiry",
              type: "uint256",
            },
          ],
          name: "renewBadge",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "revokeBadge",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
            {
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeBatchTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address[]",
              name: "tos",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "safeBatchTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "selfBurn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "tier",
              type: "uint8",
            },
          ],
          name: "setBadgeTier",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isSoulbound",
              type: "bool",
            },
          ],
          name: "setSoulbound",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "newuri",
              type: "string",
            },
          ],
          name: "setURI",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "soulbound",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "considerIds",
              type: "uint256[]",
            },
          ],
          name: "tierOf",
          outputs: [
            {
              internalType: "uint8",
              name: "tier",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "uri",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    ReputationHubImpl: {
      address: "0x8b333d3AbF1E60aDc395a9aC96F94FFCeAc7997d",
      abi: [
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "action",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "ActivityLogged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "registry",
              type: "address",
            },
          ],
          name: "RegistrySet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "appRegistry",
          outputs: [
            {
              internalType: "contract IVerseAppRegistry",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "getActivity",
          outputs: [
            {
              internalType: "uint64",
              name: "completed",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "cancelled",
              type: "uint64",
            },
            {
              internalType: "uint256",
              name: "earned",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getRawCounts",
          outputs: [
            {
              internalType: "uint64",
              name: "completed",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "cancelled",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "appRegistry_",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "logCancelled",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "logCompleted",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newRegistry",
              type: "address",
            },
          ],
          name: "setAppRegistry",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    ScoreAggregatorImpl: {
      address: "0x4C522BD407A2d50eBF2aF12233F0653ffa0609a9",
      abi: [
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "registry",
              type: "address",
            },
          ],
          name: "RegistrySet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "appScore",
          outputs: [
            {
              internalType: "uint256",
              name: "raw",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "weighted",
              type: "uint256",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "fullScore",
          outputs: [
            {
              internalType: "uint256",
              name: "total",
              type: "uint256",
            },
            {
              components: [
                {
                  internalType: "bytes32",
                  name: "appId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "rawScore",
                  type: "uint256",
                },
                {
                  internalType: "uint16",
                  name: "weightBps",
                  type: "uint16",
                },
                {
                  internalType: "uint256",
                  name: "weightedScore",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "active",
                  type: "bool",
                },
                {
                  internalType: "address",
                  name: "scoreModel",
                  type: "address",
                },
              ],
              internalType: "struct VerseScoreAggregator.AppPart[]",
              name: "parts",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "globalScore",
          outputs: [
            {
              internalType: "uint256",
              name: "total",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "registry_",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "registry",
          outputs: [
            {
              internalType: "contract IVerseAppRegistry",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newRegistry",
              type: "address",
            },
          ],
          name: "setRegistry",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    VerseProfileImpl: {
      address: "0xfEbC66328BE2302B08Eb8676a957bAc4eE768Da2",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "EnforcedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "ExpectedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "nickname",
              type: "string",
            },
          ],
          name: "AppNicknameSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "namehash",
              type: "bytes32",
            },
          ],
          name: "ENSLinked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "uri",
              type: "string",
            },
          ],
          name: "MetadataURISet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "oldOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnerChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
          ],
          name: "ProfileCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "handle",
              type: "string",
            },
          ],
          name: "VerseHandleSet",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "verseHandle",
              type: "string",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "bytes32",
              name: "ensNamehash",
              type: "bytes32",
            },
          ],
          name: "createProfile",
          outputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getAppNickname",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getDisplayHandle",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "getProfile",
          outputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "string",
              name: "verseHandle",
              type: "string",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "bytes32",
              name: "ensNamehash",
              type: "bytes32",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "hasProfile",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "namehash",
              type: "bytes32",
            },
          ],
          name: "linkENS",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "nextProfileId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "profileOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "nickname",
              type: "string",
            },
          ],
          name: "setAppNickname",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newURI",
              type: "string",
            },
          ],
          name: "setMetadataURI",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newHandle",
              type: "string",
            },
          ],
          name: "setVerseHandle",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnershipOfProfile",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "nickname",
              type: "string",
            },
          ],
          name: "verseIdByAppNickname",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "handle",
              type: "string",
            },
          ],
          name: "verseIdByHandle",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreJobBoardProxy: {
      address: "0x56a5BA686856F0787ce1B0278ED55D359A1D050e",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreJobManagerProxy: {
      address: "0x775808914a3f338eebaEd255fD4Ba6403546b57a",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreScoreModelProxy: {
      address: "0xb4741A7d2d26a59fbeF9fb17BEbb65e1acb6c5DA",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    AppRegistryProxy: {
      address: "0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    BadgeRegistryProxy: {
      address: "0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    ReputationHubProxy: {
      address: "0xB617E64D4b1C927d7cE3e35f7bbA852bC2c5c50F",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    ScoreAggregatorProxy: {
      address: "0xFC6F44E9307B2CACbA608CDc6A3D9A57876cfD66",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    VerseProfileProxy: {
      address: "0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_logic",
              type: "address",
            },
            {
              internalType: "address",
              name: "initialOwner",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          stateMutability: "payable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "ERC1967InvalidAdmin",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "ProxyDeniedAdminAccess",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "previousAdmin",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "newAdmin",
              type: "address",
            },
          ],
          name: "AdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreJobBoard: {
      address: "0x56a5BA686856F0787ce1B0278ED55D359A1D050e",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "AddressInsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "ReentrancyGuardReentrantCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "SafeERC20FailedOperation",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "ApplicationAccepted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "worker",
              type: "address",
            },
          ],
          name: "ApplicationWithdrawn",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "bid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
          ],
          name: "Applied",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
          ],
          name: "PostClosed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "budgetMax",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint64",
              name: "expiry",
              type: "uint64",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "deposit",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
          ],
          name: "PostCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "PostDepositSlashed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
          ],
          name: "PostExpired",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "uint256",
                  name: "postId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "appIndex",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "worker",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "paymentToken",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "deadline",
                  type: "uint64",
                },
                {
                  internalType: "string",
                  name: "metadataURI",
                  type: "string",
                },
                {
                  internalType: "enum IJobManager.JobType",
                  name: "jobType",
                  type: "uint8",
                },
                {
                  internalType: "uint256[]",
                  name: "amounts",
                  type: "uint256[]",
                },
                {
                  internalType: "uint64[]",
                  name: "dueDates",
                  type: "uint64[]",
                },
                {
                  internalType: "bool[]",
                  name: "requiresDeliverable",
                  type: "bool[]",
                },
              ],
              internalType: "struct HireCoreJobBoard.AcceptParams",
              name: "params",
              type: "tuple",
            },
          ],
          name: "accept",
          outputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "applications",
          outputs: [
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "bidAmount",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
            {
              internalType: "bool",
              name: "withdrawn",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "bidAmount",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
          ],
          name: "applyNow",
          outputs: [
            {
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          name: "close",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "coreToken",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "budgetMax",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "duration",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
          ],
          name: "createPost",
          outputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          name: "expire",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
          ],
          name: "getApplication",
          outputs: [
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "bidAmount",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "proposalURI",
              type: "string",
            },
            {
              internalType: "bool",
              name: "withdrawn",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
          ],
          name: "getApplicationsCount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "jobManager_",
              type: "address",
            },
            {
              internalType: "address",
              name: "coreToken_",
              type: "address",
            },
            {
              internalType: "address",
              name: "treasury_",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "minDeposit_",
              type: "uint256",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "jobManager",
          outputs: [
            {
              internalType: "contract IJobManager",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "minDeposit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nextPostId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "posts",
          outputs: [
            {
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "budgetMax",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "expiry",
              type: "uint64",
            },
            {
              internalType: "uint256",
              name: "deposit",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "bool",
              name: "open",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newCoreToken",
              type: "address",
            },
          ],
          name: "setCoreToken",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newJobManager",
              type: "address",
            },
          ],
          name: "setJobManager",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "newDeposit",
              type: "uint256",
            },
          ],
          name: "setMinDeposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "setTreasury",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "treasury",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "postId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "appIndex",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreJobManager: {
      address: "0x775808914a3f338eebaEd255fD4Ba6403546b57a",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "AddressInsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "EnforcedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "ExpectedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "ReentrancyGuardReentrantCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "SafeERC20FailedOperation",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "badgeRegistry",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "tierBadgeIds",
              type: "uint256[]",
            },
          ],
          name: "BadgeRegistryUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint16",
              name: "baseFeeBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "workerDiscountBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "hirerDiscountBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "uint8",
              name: "minTier",
              type: "uint8",
            },
          ],
          name: "FeesUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "refund",
              type: "uint256",
            },
          ],
          name: "JobCancelled",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              indexed: false,
              internalType: "enum HireCoreJobManager.JobType",
              name: "jobType",
              type: "uint8",
            },
            {
              indexed: false,
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "feeBps",
              type: "uint16",
            },
          ],
          name: "JobCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "reason",
              type: "string",
            },
          ],
          name: "JobDisputed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "fundedTotal",
              type: "uint256",
            },
          ],
          name: "JobFunded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "workerPayout",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "hirerRefund",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "feeTaken",
              type: "uint256",
            },
          ],
          name: "JobResolved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "newURI",
              type: "string",
            },
          ],
          name: "MetadataURIUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "deliverableURI",
              type: "string",
            },
            {
              indexed: false,
              internalType: "string",
              name: "note",
              type: "string",
            },
          ],
          name: "MilestoneDelivered",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "netToWorker",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "feeToTreasury",
              type: "uint256",
            },
          ],
          name: "MilestoneReleased",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "bool",
              name: "enabled",
              type: "bool",
            },
          ],
          name: "NativeToggle",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "hub",
              type: "address",
            },
          ],
          name: "ReputationHubSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "allowed",
              type: "bool",
            },
          ],
          name: "TokenAllowed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "TreasuryUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "verseProfile",
              type: "address",
            },
          ],
          name: "VerseProfileSet",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "RESOLVER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "bool",
              name: "allowed",
              type: "bool",
            },
          ],
          name: "allowPaymentToken",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "allowedPaymentToken",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "badgeRegistry",
          outputs: [
            {
              internalType: "contract IBadgeRegistry",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "baseFeeBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "cancelJob",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "worker",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "paymentToken",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "deadline",
                  type: "uint64",
                },
                {
                  internalType: "string",
                  name: "metadataURI",
                  type: "string",
                },
                {
                  internalType: "enum HireCoreJobManager.JobType",
                  name: "jobType",
                  type: "uint8",
                },
                {
                  internalType: "uint256[]",
                  name: "amounts",
                  type: "uint256[]",
                },
                {
                  internalType: "uint64[]",
                  name: "dueDates",
                  type: "uint64[]",
                },
                {
                  internalType: "bool[]",
                  name: "requiresDeliverable",
                  type: "bool[]",
                },
              ],
              internalType: "struct HireCoreJobManager.CreateJobParams",
              name: "p",
              type: "tuple",
            },
          ],
          name: "createJob",
          outputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "deliverableURI",
              type: "string",
            },
            {
              internalType: "string",
              name: "note",
              type: "string",
            },
          ],
          name: "deliverMilestone",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "reason",
              type: "string",
            },
          ],
          name: "disputeJob",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "fundJob",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "fundJobNative",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          name: "fundJobWithPermit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
          ],
          name: "getJobCore",
          outputs: [
            {
              internalType: "address",
              name: "hirer",
              type: "address",
            },
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "address",
              name: "paymentToken",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "totalAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fundedAmount",
              type: "uint256",
            },
            {
              internalType: "uint16",
              name: "feeBpsAtCreation",
              type: "uint16",
            },
            {
              internalType: "enum HireCoreJobManager.JobStatus",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "enum HireCoreJobManager.JobType",
              name: "jobType",
              type: "uint8",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "deadline",
              type: "uint64",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "milestonesCount",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "getMilestone",
          outputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint64",
              name: "dueDate",
              type: "uint64",
            },
            {
              internalType: "bool",
              name: "delivered",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "released",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "requiresDeliverable",
              type: "bool",
            },
            {
              internalType: "string",
              name: "deliverableURI",
              type: "string",
            },
            {
              internalType: "string",
              name: "note",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "hirerDiscountBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "treasury_",
              type: "address",
            },
            {
              internalType: "address",
              name: "verseProfile_",
              type: "address",
            },
            {
              internalType: "address",
              name: "reputationHub_",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "baseFeeBps_",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "maxFeeBps_",
              type: "uint16",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "maxFeeBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "minTierForDiscount",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nativePaymentsEnabled",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "nextJobId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "milestoneIndex",
              type: "uint256",
            },
          ],
          name: "releaseMilestone",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "reputationHub",
          outputs: [
            {
              internalType: "contract IVerseReputationHub",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "workerPayout",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "hirerRefund",
              type: "uint256",
            },
          ],
          name: "resolveDispute",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "reg",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
          ],
          name: "setBadgeRegistry",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint16",
              name: "baseFeeBps_",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "workerDiscountBps_",
              type: "uint16",
            },
            {
              internalType: "uint16",
              name: "hirerDiscountBps_",
              type: "uint16",
            },
            {
              internalType: "uint8",
              name: "minTier_",
              type: "uint8",
            },
          ],
          name: "setFees",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint16",
              name: "maxFeeBps_",
              type: "uint16",
            },
          ],
          name: "setMaxFeeBps",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "hub",
              type: "address",
            },
          ],
          name: "setReputationHub",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newTreasury",
              type: "address",
            },
          ],
          name: "setTreasury",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "vp",
              type: "address",
            },
          ],
          name: "setVerseProfile",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "tierBadgeIds",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bool",
              name: "enabled",
              type: "bool",
            },
          ],
          name: "toggleNative",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "treasury",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "jobId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newURI",
              type: "string",
            },
          ],
          name: "updateJobMetadataURI",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "verseProfile",
          outputs: [
            {
              internalType: "contract IVerseProfile",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "workerDiscountBps",
          outputs: [
            {
              internalType: "uint16",
              name: "",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      deployedOnBlock: 0,
    },
    HireCoreScoreModel: {
      address: "0xb4741A7d2d26a59fbeF9fb17BEbb65e1acb6c5DA",
      abi: [
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "hub",
              type: "address",
            },
          ],
          name: "HubSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "completedWeight",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "cancelledPenalty",
              type: "uint256",
            },
          ],
          name: "WeightsUpdated",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "APP_ID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "cancelledPenalty",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "completedWeight",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "hub",
          outputs: [
            {
              internalType: "contract IVerseReputationHub",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "hub_",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "scoreOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "hub_",
              type: "address",
            },
          ],
          name: "setHub",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "completedWeight_",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "cancelledPenalty_",
              type: "uint256",
            },
          ],
          name: "setWeights",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    AppRegistry: {
      address: "0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "AppActiveUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "newName",
              type: "string",
            },
          ],
          name: "AppNameUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              indexed: false,
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "AppRegistered",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "AppRemoved",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
          ],
          name: "AppScoreModelUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              indexed: false,
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "AppUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "AppWeightUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "address",
              name: "writer",
              type: "address",
            },
          ],
          name: "AppWriterUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "allAppIds",
          outputs: [
            {
              internalType: "bytes32[]",
              name: "",
              type: "bytes32[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "appConfigOf",
          outputs: [
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "appIds",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "computeAppScore",
          outputs: [
            {
              internalType: "uint256",
              name: "rawScore",
              type: "uint256",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getApp",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "writer",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "scoreModel",
                  type: "address",
                },
                {
                  internalType: "uint16",
                  name: "weightBps",
                  type: "uint16",
                },
                {
                  internalType: "bool",
                  name: "active",
                  type: "bool",
                },
              ],
              internalType: "struct VerseAppRegistry.App",
              name: "",
              type: "tuple",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "isActive",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "candidate",
              type: "address",
            },
          ],
          name: "isWriter",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "registerApp",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "removeApp",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "setAppActive",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "newName",
              type: "string",
            },
          ],
          name: "setAppName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
          ],
          name: "setAppScoreModel",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
          ],
          name: "setAppWeight",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
          ],
          name: "setAppWriter",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "writer",
              type: "address",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
          ],
          name: "updateApp",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    BadgeRegistry: {
      address: "0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ERC1155InsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address",
            },
          ],
          name: "ERC1155InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "idsLength",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "valuesLength",
              type: "uint256",
            },
          ],
          name: "ERC1155InvalidArrayLength",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "ERC1155InvalidOperator",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "ERC1155InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "ERC1155InvalidSender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC1155MissingApprovalForAll",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "EnforcedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "ExpectedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "expiry",
              type: "uint256",
            },
          ],
          name: "BadgeMinted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "newExpiry",
              type: "uint256",
            },
          ],
          name: "BadgeRenewed",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "BadgeRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "isSoulbound",
              type: "bool",
            },
          ],
          name: "SoulboundSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint8",
              name: "tier",
              type: "uint8",
            },
          ],
          name: "TierSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]",
            },
          ],
          name: "TransferBatch",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "TransferSingle",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "value",
              type: "string",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "URI",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "MINTER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "REVOKER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "badgeTier",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address[]",
              name: "accounts",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
          ],
          name: "balanceOfBatch",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "expiryOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "badgeIds",
              type: "uint256[]",
            },
          ],
          name: "hasAny",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "hasBadge",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "string",
              name: "baseURI",
              type: "string",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expiry",
              type: "uint256",
            },
          ],
          name: "mintBadge",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "newExpiry",
              type: "uint256",
            },
          ],
          name: "renewBadge",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "revokeBadge",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]",
            },
            {
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeBatchTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address[]",
              name: "tos",
              type: "address[]",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "safeBatchTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
          ],
          name: "selfBurn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "tier",
              type: "uint8",
            },
          ],
          name: "setBadgeTier",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "badgeId",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isSoulbound",
              type: "bool",
            },
          ],
          name: "setSoulbound",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "newuri",
              type: "string",
            },
          ],
          name: "setURI",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "soulbound",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              internalType: "uint256[]",
              name: "considerIds",
              type: "uint256[]",
            },
          ],
          name: "tierOf",
          outputs: [
            {
              internalType: "uint8",
              name: "tier",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "uri",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    ReputationHub: {
      address: "0xB617E64D4b1C927d7cE3e35f7bbA852bC2c5c50F",
      abi: [
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "action",
              type: "string",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "ActivityLogged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "registry",
              type: "address",
            },
          ],
          name: "RegistrySet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "appRegistry",
          outputs: [
            {
              internalType: "contract IVerseAppRegistry",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "getActivity",
          outputs: [
            {
              internalType: "uint64",
              name: "completed",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "cancelled",
              type: "uint64",
            },
            {
              internalType: "uint256",
              name: "earned",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getRawCounts",
          outputs: [
            {
              internalType: "uint64",
              name: "completed",
              type: "uint64",
            },
            {
              internalType: "uint64",
              name: "cancelled",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "appRegistry_",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "logCancelled",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "logCompleted",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newRegistry",
              type: "address",
            },
          ],
          name: "setAppRegistry",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    ScoreAggregator: {
      address: "0xFC6F44E9307B2CACbA608CDc6A3D9A57876cfD66",
      abi: [
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "registry",
              type: "address",
            },
          ],
          name: "RegistrySet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "appScore",
          outputs: [
            {
              internalType: "uint256",
              name: "raw",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "weighted",
              type: "uint256",
            },
            {
              internalType: "uint16",
              name: "weightBps",
              type: "uint16",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
            {
              internalType: "address",
              name: "scoreModel",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "fullScore",
          outputs: [
            {
              internalType: "uint256",
              name: "total",
              type: "uint256",
            },
            {
              components: [
                {
                  internalType: "bytes32",
                  name: "appId",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "rawScore",
                  type: "uint256",
                },
                {
                  internalType: "uint16",
                  name: "weightBps",
                  type: "uint16",
                },
                {
                  internalType: "uint256",
                  name: "weightedScore",
                  type: "uint256",
                },
                {
                  internalType: "bool",
                  name: "active",
                  type: "bool",
                },
                {
                  internalType: "address",
                  name: "scoreModel",
                  type: "address",
                },
              ],
              internalType: "struct VerseScoreAggregator.AppPart[]",
              name: "parts",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "globalScore",
          outputs: [
            {
              internalType: "uint256",
              name: "total",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
            {
              internalType: "address",
              name: "registry_",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "registry",
          outputs: [
            {
              internalType: "contract IVerseAppRegistry",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newRegistry",
              type: "address",
            },
          ],
          name: "setRegistry",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
    VerseProfile: {
      address: "0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E",
      abi: [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "AccessControlBadConfirmation",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "bytes32",
              name: "neededRole",
              type: "bytes32",
            },
          ],
          name: "AccessControlUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "EnforcedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "ExpectedPause",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              indexed: false,
              internalType: "string",
              name: "nickname",
              type: "string",
            },
          ],
          name: "AppNicknameSet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "bytes32",
              name: "namehash",
              type: "bytes32",
            },
          ],
          name: "ENSLinked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "uri",
              type: "string",
            },
          ],
          name: "MetadataURISet",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "oldOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnerChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: false,
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
          ],
          name: "ProfileCreated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "handle",
              type: "string",
            },
          ],
          name: "VerseHandleSet",
          type: "event",
        },
        {
          inputs: [],
          name: "ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "verseHandle",
              type: "string",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "bytes32",
              name: "ensNamehash",
              type: "bytes32",
            },
          ],
          name: "createProfile",
          outputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getAppNickname",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
          ],
          name: "getDisplayHandle",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
          ],
          name: "getProfile",
          outputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "string",
              name: "verseHandle",
              type: "string",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "bytes32",
              name: "ensNamehash",
              type: "bytes32",
            },
            {
              internalType: "uint64",
              name: "createdAt",
              type: "uint64",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "hasProfile",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "admin",
              type: "address",
            },
          ],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "namehash",
              type: "bytes32",
            },
          ],
          name: "linkENS",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "nextProfileId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "profileOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "callerConfirmation",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "nickname",
              type: "string",
            },
          ],
          name: "setAppNickname",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newURI",
              type: "string",
            },
          ],
          name: "setMetadataURI",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newHandle",
              type: "string",
            },
          ],
          name: "setVerseHandle",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "verseId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnershipOfProfile",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "appId",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "nickname",
              type: "string",
            },
          ],
          name: "verseIdByAppNickname",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "handle",
              type: "string",
            },
          ],
          name: "verseIdByHandle",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      deployedOnBlock: 0,
    },
  },
  chainNames: {
    "31337": "localhost",
    "42220": "celo",
    "44787": "alfajores",
    "62320": "baklava",
    "11142220": "celoSepolia",
  },
  deployments: {
    "31337": {
      CoreToken: {
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: [
          {
            inputs: [
              {
                internalType: "string",
                name: "name_",
                type: "string",
              },
              {
                internalType: "string",
                name: "symbol_",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "initialSupply_",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "treasury_",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "feeBps_",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "feeBurns_",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "allowance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
            ],
            name: "ERC20InsufficientAllowance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
            ],
            name: "ERC20InsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "approver",
                type: "address",
              },
            ],
            name: "ERC20InvalidApprover",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "receiver",
                type: "address",
              },
            ],
            name: "ERC20InvalidReceiver",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "ERC20InvalidSender",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "ERC20InvalidSpender",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "OwnableInvalidOwner",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "OwnableUnauthorizedAccount",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "oldBps",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newBps",
                type: "uint256",
              },
            ],
            name: "FeeBpsUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "bool",
                name: "oldMode",
                type: "bool",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "newMode",
                type: "bool",
              },
            ],
            name: "FeeBurnModeUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "exempt",
                type: "bool",
              },
            ],
            name: "FeeExemptUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "oldTreasury",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "TreasuryUpdated",
            type: "event",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "burn",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "feeBps",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "feeBurns",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "isFeeExempt",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "name",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newBps",
                type: "uint256",
              },
            ],
            name: "setFeeBps",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bool",
                name: "newMode",
                type: "bool",
              },
            ],
            name: "setFeeBurnMode",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bool",
                name: "exempt",
                type: "bool",
              },
            ],
            name: "setFeeExempt",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "setTreasury",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "treasury",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      CoreFaucet: {
        address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        abi: [
          {
            inputs: [
              {
                internalType: "contract IERC20",
                name: "core_",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amountPerClaim_",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cooldownSeconds_",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "ECDSAInvalidSignature",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "length",
                type: "uint256",
              },
            ],
            name: "ECDSAInvalidSignatureLength",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            name: "ECDSAInvalidSignatureS",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidShortString",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "OwnableInvalidOwner",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "OwnableUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "str",
                type: "string",
              },
            ],
            name: "StringTooLong",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "oldAmount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newAmount",
                type: "uint256",
              },
            ],
            name: "AmountPerClaimUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "who",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            name: "Claimed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "oldSeconds",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newSeconds",
                type: "uint256",
              },
            ],
            name: "CooldownUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "Drain",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [],
            name: "EIP712DomainChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "bool",
                name: "oldPaused",
                type: "bool",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "newPaused",
                type: "bool",
              },
            ],
            name: "PausedUpdated",
            type: "event",
          },
          {
            inputs: [],
            name: "CLAIM_TYPEHASH",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "amountPerClaim",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "claim",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
              },
              {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
              },
            ],
            name: "claimWithSig",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "cooldownSeconds",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "core",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "drain",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "eip712Domain",
            outputs: [
              {
                internalType: "bytes1",
                name: "fields",
                type: "bytes1",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "version",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "verifyingContract",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
              },
              {
                internalType: "uint256[]",
                name: "extensions",
                type: "uint256[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "lastClaimTimestamp",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "nonces",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newAmount",
                type: "uint256",
              },
            ],
            name: "setAmountPerClaim",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newSeconds",
                type: "uint256",
              },
            ],
            name: "setCooldownSeconds",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bool",
                name: "newPaused",
                type: "bool",
              },
            ],
            name: "setPaused",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
    },
    "11142220": {
      CoreToken: {
        address: "0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94",
        abi: [
          {
            inputs: [
              {
                internalType: "string",
                name: "name_",
                type: "string",
              },
              {
                internalType: "string",
                name: "symbol_",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "initialSupply_",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "treasury_",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "feeBps_",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "feeBurns_",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "allowance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
            ],
            name: "ERC20InsufficientAllowance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
            ],
            name: "ERC20InsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "approver",
                type: "address",
              },
            ],
            name: "ERC20InvalidApprover",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "receiver",
                type: "address",
              },
            ],
            name: "ERC20InvalidReceiver",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "ERC20InvalidSender",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "ERC20InvalidSpender",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "OwnableInvalidOwner",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "OwnableUnauthorizedAccount",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Approval",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "oldBps",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newBps",
                type: "uint256",
              },
            ],
            name: "FeeBpsUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "bool",
                name: "oldMode",
                type: "bool",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "newMode",
                type: "bool",
              },
            ],
            name: "FeeBurnModeUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "exempt",
                type: "bool",
              },
            ],
            name: "FeeExemptUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "Transfer",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "oldTreasury",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "TreasuryUpdated",
            type: "event",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "burn",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "feeBps",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "feeBurns",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "isFeeExempt",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "name",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newBps",
                type: "uint256",
              },
            ],
            name: "setFeeBps",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bool",
                name: "newMode",
                type: "bool",
              },
            ],
            name: "setFeeBurnMode",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bool",
                name: "exempt",
                type: "bool",
              },
            ],
            name: "setFeeExempt",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "setTreasury",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "totalSupply",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "transfer",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "transferFrom",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "treasury",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      CoreFaucet: {
        address: "0xb5d8887AB09AdB5983AACEed4e1AbB9267407823",
        abi: [
          {
            inputs: [
              {
                internalType: "contract IERC20",
                name: "core_",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amountPerClaim_",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cooldownSeconds_",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "ECDSAInvalidSignature",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "length",
                type: "uint256",
              },
            ],
            name: "ECDSAInvalidSignatureLength",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            name: "ECDSAInvalidSignatureS",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidShortString",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "OwnableInvalidOwner",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "OwnableUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "str",
                type: "string",
              },
            ],
            name: "StringTooLong",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "oldAmount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newAmount",
                type: "uint256",
              },
            ],
            name: "AmountPerClaimUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "who",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            name: "Claimed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "oldSeconds",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newSeconds",
                type: "uint256",
              },
            ],
            name: "CooldownUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "Drain",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [],
            name: "EIP712DomainChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnershipTransferred",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "bool",
                name: "oldPaused",
                type: "bool",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "newPaused",
                type: "bool",
              },
            ],
            name: "PausedUpdated",
            type: "event",
          },
          {
            inputs: [],
            name: "CLAIM_TYPEHASH",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "amountPerClaim",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "claim",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
              },
              {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
              },
            ],
            name: "claimWithSig",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "cooldownSeconds",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "core",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "drain",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "eip712Domain",
            outputs: [
              {
                internalType: "bytes1",
                name: "fields",
                type: "bytes1",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "version",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "chainId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "verifyingContract",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
              },
              {
                internalType: "uint256[]",
                name: "extensions",
                type: "uint256[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "lastClaimTimestamp",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "nonces",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "owner",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newAmount",
                type: "uint256",
              },
            ],
            name: "setAmountPerClaim",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newSeconds",
                type: "uint256",
              },
            ],
            name: "setCooldownSeconds",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bool",
                name: "newPaused",
                type: "bool",
              },
            ],
            name: "setPaused",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnership",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      
      HireCoreJobBoardImpl: {
        address: "0x5D9f9167124B14E73aBb8f9A98273e8c00d5f1fa",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "AddressInsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "ReentrancyGuardReentrantCall",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "SafeERC20FailedOperation",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "ApplicationAccepted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "worker",
                type: "address",
              },
            ],
            name: "ApplicationWithdrawn",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "bid",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
            ],
            name: "Applied",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
            ],
            name: "PostClosed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "budgetMax",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint64",
                name: "expiry",
                type: "uint64",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "deposit",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
            ],
            name: "PostCreated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "PostDepositSlashed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
            ],
            name: "PostExpired",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "postId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "appIndex",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "worker",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "paymentToken",
                    type: "address",
                  },
                  {
                    internalType: "uint64",
                    name: "deadline",
                    type: "uint64",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "enum IJobManager.JobType",
                    name: "jobType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256[]",
                    name: "amounts",
                    type: "uint256[]",
                  },
                  {
                    internalType: "uint64[]",
                    name: "dueDates",
                    type: "uint64[]",
                  },
                  {
                    internalType: "bool[]",
                    name: "requiresDeliverable",
                    type: "bool[]",
                  },
                ],
                internalType: "struct HireCoreJobBoard.AcceptParams",
                name: "params",
                type: "tuple",
              },
            ],
            name: "accept",
            outputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "applications",
            outputs: [
              {
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "bidAmount",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
              {
                internalType: "bool",
                name: "withdrawn",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "bidAmount",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
            ],
            name: "applyNow",
            outputs: [
              {
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            name: "close",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "coreToken",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "budgetMax",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "duration",
                type: "uint64",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
            ],
            name: "createPost",
            outputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            name: "expire",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
            ],
            name: "getApplication",
            outputs: [
              {
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "bidAmount",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
              {
                internalType: "bool",
                name: "withdrawn",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            name: "getApplicationsCount",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "jobManager_",
                type: "address",
              },
              {
                internalType: "address",
                name: "coreToken_",
                type: "address",
              },
              {
                internalType: "address",
                name: "treasury_",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "minDeposit_",
                type: "uint256",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "jobManager",
            outputs: [
              {
                internalType: "contract IJobManager",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "minDeposit",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "nextPostId",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "posts",
            outputs: [
              {
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "budgetMax",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "expiry",
                type: "uint64",
              },
              {
                internalType: "uint256",
                name: "deposit",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "bool",
                name: "open",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newCoreToken",
                type: "address",
              },
            ],
            name: "setCoreToken",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newJobManager",
                type: "address",
              },
            ],
            name: "setJobManager",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newDeposit",
                type: "uint256",
              },
            ],
            name: "setMinDeposit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "setTreasury",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "treasury",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
            ],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreJobManagerImpl: {
        address: "0xE7C75f8CD443F8091AC1F41eceB4A65DaF30E459",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "AddressInsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "EnforcedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "ExpectedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "ReentrancyGuardReentrantCall",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "SafeERC20FailedOperation",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "badgeRegistry",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256[]",
                name: "tierBadgeIds",
                type: "uint256[]",
              },
            ],
            name: "BadgeRegistryUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint16",
                name: "baseFeeBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "workerDiscountBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "hirerDiscountBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "uint8",
                name: "minTier",
                type: "uint8",
              },
            ],
            name: "FeesUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "refund",
                type: "uint256",
              },
            ],
            name: "JobCancelled",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                indexed: false,
                internalType: "enum HireCoreJobManager.JobType",
                name: "jobType",
                type: "uint8",
              },
              {
                indexed: false,
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "totalAmount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "feeBps",
                type: "uint16",
              },
            ],
            name: "JobCreated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "reason",
                type: "string",
              },
            ],
            name: "JobDisputed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "fundedTotal",
                type: "uint256",
              },
            ],
            name: "JobFunded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "workerPayout",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "hirerRefund",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "feeTaken",
                type: "uint256",
              },
            ],
            name: "JobResolved",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "newURI",
                type: "string",
              },
            ],
            name: "MetadataURIUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "deliverableURI",
                type: "string",
              },
              {
                indexed: false,
                internalType: "string",
                name: "note",
                type: "string",
              },
            ],
            name: "MilestoneDelivered",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "netToWorker",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "feeToTreasury",
                type: "uint256",
              },
            ],
            name: "MilestoneReleased",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "bool",
                name: "enabled",
                type: "bool",
              },
            ],
            name: "NativeToggle",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Paused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "hub",
                type: "address",
              },
            ],
            name: "ReputationHubSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "allowed",
                type: "bool",
              },
            ],
            name: "TokenAllowed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "TreasuryUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Unpaused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "verseProfile",
                type: "address",
              },
            ],
            name: "VerseProfileSet",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "RESOLVER_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "bool",
                name: "allowed",
                type: "bool",
              },
            ],
            name: "allowPaymentToken",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "allowedPaymentToken",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "badgeRegistry",
            outputs: [
              {
                internalType: "contract IBadgeRegistry",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "baseFeeBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "cancelJob",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                components: [
                  {
                    internalType: "address",
                    name: "worker",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "paymentToken",
                    type: "address",
                  },
                  {
                    internalType: "uint64",
                    name: "deadline",
                    type: "uint64",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "enum HireCoreJobManager.JobType",
                    name: "jobType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256[]",
                    name: "amounts",
                    type: "uint256[]",
                  },
                  {
                    internalType: "uint64[]",
                    name: "dueDates",
                    type: "uint64[]",
                  },
                  {
                    internalType: "bool[]",
                    name: "requiresDeliverable",
                    type: "bool[]",
                  },
                ],
                internalType: "struct HireCoreJobManager.CreateJobParams",
                name: "p",
                type: "tuple",
              },
            ],
            name: "createJob",
            outputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "deliverableURI",
                type: "string",
              },
              {
                internalType: "string",
                name: "note",
                type: "string",
              },
            ],
            name: "deliverMilestone",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "reason",
                type: "string",
              },
            ],
            name: "disputeJob",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "fundJob",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "fundJobNative",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            name: "fundJobWithPermit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "getJobCore",
            outputs: [
              {
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "totalAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "fundedAmount",
                type: "uint256",
              },
              {
                internalType: "uint16",
                name: "feeBpsAtCreation",
                type: "uint16",
              },
              {
                internalType: "enum HireCoreJobManager.JobStatus",
                name: "status",
                type: "uint8",
              },
              {
                internalType: "enum HireCoreJobManager.JobType",
                name: "jobType",
                type: "uint8",
              },
              {
                internalType: "uint64",
                name: "createdAt",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "deadline",
                type: "uint64",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "milestonesCount",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "index",
                type: "uint256",
              },
            ],
            name: "getMilestone",
            outputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "dueDate",
                type: "uint64",
              },
              {
                internalType: "bool",
                name: "delivered",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "released",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "requiresDeliverable",
                type: "bool",
              },
              {
                internalType: "string",
                name: "deliverableURI",
                type: "string",
              },
              {
                internalType: "string",
                name: "note",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "hirerDiscountBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "treasury_",
                type: "address",
              },
              {
                internalType: "address",
                name: "verseProfile_",
                type: "address",
              },
              {
                internalType: "address",
                name: "reputationHub_",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "baseFeeBps_",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "maxFeeBps_",
                type: "uint16",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "maxFeeBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "minTierForDiscount",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "nativePaymentsEnabled",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "nextJobId",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
            ],
            name: "releaseMilestone",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "reputationHub",
            outputs: [
              {
                internalType: "contract IVerseReputationHub",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "workerPayout",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "hirerRefund",
                type: "uint256",
              },
            ],
            name: "resolveDispute",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "reg",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
            ],
            name: "setBadgeRegistry",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint16",
                name: "baseFeeBps_",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "workerDiscountBps_",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "hirerDiscountBps_",
                type: "uint16",
              },
              {
                internalType: "uint8",
                name: "minTier_",
                type: "uint8",
              },
            ],
            name: "setFees",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint16",
                name: "maxFeeBps_",
                type: "uint16",
              },
            ],
            name: "setMaxFeeBps",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "hub",
                type: "address",
              },
            ],
            name: "setReputationHub",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "setTreasury",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "vp",
                type: "address",
              },
            ],
            name: "setVerseProfile",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "tierBadgeIds",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bool",
                name: "enabled",
                type: "bool",
              },
            ],
            name: "toggleNative",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "treasury",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "newURI",
                type: "string",
              },
            ],
            name: "updateJobMetadataURI",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [],
            name: "verseProfile",
            outputs: [
              {
                internalType: "contract IVerseProfile",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "workerDiscountBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            stateMutability: "payable",
            type: "receive",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreScoreModelImpl: {
        address: "0xeD7D699e59a2B51c5Ac420eC894dF7748A31Fb64",
        abi: [
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "hub",
                type: "address",
              },
            ],
            name: "HubSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "completedWeight",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "cancelledPenalty",
                type: "uint256",
              },
            ],
            name: "WeightsUpdated",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "APP_ID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "cancelledPenalty",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "completedWeight",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "hub",
            outputs: [
              {
                internalType: "contract IVerseReputationHub",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "hub_",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "scoreOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "hub_",
                type: "address",
              },
            ],
            name: "setHub",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "completedWeight_",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cancelledPenalty_",
                type: "uint256",
              },
            ],
            name: "setWeights",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      AppRegistryImpl: {
        address: "0x2CadB5226c5E4FCFd5Ec40624f407F008f49b5A4",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "AppActiveUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "newName",
                type: "string",
              },
            ],
            name: "AppNameUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                indexed: false,
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "AppRegistered",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "AppRemoved",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
            ],
            name: "AppScoreModelUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "AppUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "AppWeightUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "address",
                name: "writer",
                type: "address",
              },
            ],
            name: "AppWriterUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "allAppIds",
            outputs: [
              {
                internalType: "bytes32[]",
                name: "",
                type: "bytes32[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "appConfigOf",
            outputs: [
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "appIds",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "computeAppScore",
            outputs: [
              {
                internalType: "uint256",
                name: "rawScore",
                type: "uint256",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getApp",
            outputs: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "writer",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "scoreModel",
                    type: "address",
                  },
                  {
                    internalType: "uint16",
                    name: "weightBps",
                    type: "uint16",
                  },
                  {
                    internalType: "bool",
                    name: "active",
                    type: "bool",
                  },
                ],
                internalType: "struct VerseAppRegistry.App",
                name: "",
                type: "tuple",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "isActive",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "candidate",
                type: "address",
              },
            ],
            name: "isWriter",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "registerApp",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "removeApp",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "setAppActive",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "newName",
                type: "string",
              },
            ],
            name: "setAppName",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
            ],
            name: "setAppScoreModel",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "setAppWeight",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
            ],
            name: "setAppWriter",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "updateApp",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      BadgeRegistryImpl: {
        address: "0xd14B8d9917c689a5e39dDC65fBEb2846e95C8f43",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "ERC1155InsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "approver",
                type: "address",
              },
            ],
            name: "ERC1155InvalidApprover",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "idsLength",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "valuesLength",
                type: "uint256",
              },
            ],
            name: "ERC1155InvalidArrayLength",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
            ],
            name: "ERC1155InvalidOperator",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "receiver",
                type: "address",
              },
            ],
            name: "ERC1155InvalidReceiver",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "ERC1155InvalidSender",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "ERC1155MissingApprovalForAll",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "EnforcedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "ExpectedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
              },
            ],
            name: "ApprovalForAll",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
              },
            ],
            name: "BadgeMinted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newExpiry",
                type: "uint256",
              },
            ],
            name: "BadgeRenewed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "BadgeRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Paused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "isSoulbound",
                type: "bool",
              },
            ],
            name: "SoulboundSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint8",
                name: "tier",
                type: "uint8",
              },
            ],
            name: "TierSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
              {
                indexed: false,
                internalType: "uint256[]",
                name: "values",
                type: "uint256[]",
              },
            ],
            name: "TransferBatch",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "TransferSingle",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "string",
                name: "value",
                type: "string",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
            ],
            name: "URI",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Unpaused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "MINTER_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "REVOKER_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "badgeTier",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address[]",
                name: "accounts",
                type: "address[]",
              },
              {
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
            ],
            name: "balanceOfBatch",
            outputs: [
              {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "expiryOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "badgeIds",
                type: "uint256[]",
              },
            ],
            name: "hasAny",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "hasBadge",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "string",
                name: "baseURI",
                type: "string",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
            ],
            name: "isApprovedForAll",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
              },
            ],
            name: "mintBadge",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "newExpiry",
                type: "uint256",
              },
            ],
            name: "renewBadge",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "revokeBadge",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "values",
                type: "uint256[]",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "safeBatchTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address[]",
                name: "tos",
                type: "address[]",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
            ],
            name: "safeBatchTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "selfBurn",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                internalType: "bool",
                name: "approved",
                type: "bool",
              },
            ],
            name: "setApprovalForAll",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "tier",
                type: "uint8",
              },
            ],
            name: "setBadgeTier",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isSoulbound",
                type: "bool",
              },
            ],
            name: "setSoulbound",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "newuri",
                type: "string",
              },
            ],
            name: "setURI",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "soulbound",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "considerIds",
                type: "uint256[]",
              },
            ],
            name: "tierOf",
            outputs: [
              {
                internalType: "uint8",
                name: "tier",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "uri",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      ReputationHubImpl: {
        address: "0xcBa6C6fd521654EE23d9F1A9d599fCcBE4AF07E0",
        abi: [
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "action",
                type: "string",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "ActivityLogged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "registry",
                type: "address",
              },
            ],
            name: "RegistrySet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "appRegistry",
            outputs: [
              {
                internalType: "contract IVerseAppRegistry",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "getActivity",
            outputs: [
              {
                internalType: "uint64",
                name: "completed",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "cancelled",
                type: "uint64",
              },
              {
                internalType: "uint256",
                name: "earned",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getRawCounts",
            outputs: [
              {
                internalType: "uint64",
                name: "completed",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "cancelled",
                type: "uint64",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "appRegistry_",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "logCancelled",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "logCompleted",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newRegistry",
                type: "address",
              },
            ],
            name: "setAppRegistry",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      ScoreAggregatorImpl: {
        address: "0x90270570AEFf64E3D4c9F7C6b2781394B9100d75",
        abi: [
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "registry",
                type: "address",
              },
            ],
            name: "RegistrySet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "appScore",
            outputs: [
              {
                internalType: "uint256",
                name: "raw",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "weighted",
                type: "uint256",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "fullScore",
            outputs: [
              {
                internalType: "uint256",
                name: "total",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "appId",
                    type: "bytes32",
                  },
                  {
                    internalType: "uint256",
                    name: "rawScore",
                    type: "uint256",
                  },
                  {
                    internalType: "uint16",
                    name: "weightBps",
                    type: "uint16",
                  },
                  {
                    internalType: "uint256",
                    name: "weightedScore",
                    type: "uint256",
                  },
                  {
                    internalType: "bool",
                    name: "active",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "scoreModel",
                    type: "address",
                  },
                ],
                internalType: "struct VerseScoreAggregator.AppPart[]",
                name: "parts",
                type: "tuple[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "globalScore",
            outputs: [
              {
                internalType: "uint256",
                name: "total",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "registry_",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "registry",
            outputs: [
              {
                internalType: "contract IVerseAppRegistry",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newRegistry",
                type: "address",
              },
            ],
            name: "setRegistry",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      VerseProfileImpl: {
        address: "0x94d4dAfF7500700660A844f1C86B852d424881bf",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "EnforcedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "ExpectedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "nickname",
                type: "string",
              },
            ],
            name: "AppNicknameSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "bytes32",
                name: "namehash",
                type: "bytes32",
              },
            ],
            name: "ENSLinked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "uri",
                type: "string",
              },
            ],
            name: "MetadataURISet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnerChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Paused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: false,
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
            ],
            name: "ProfileCreated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Unpaused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "handle",
                type: "string",
              },
            ],
            name: "VerseHandleSet",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "verseHandle",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "bytes32",
                name: "ensNamehash",
                type: "bytes32",
              },
            ],
            name: "createProfile",
            outputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getAppNickname",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getDisplayHandle",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "getProfile",
            outputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "string",
                name: "verseHandle",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "bytes32",
                name: "ensNamehash",
                type: "bytes32",
              },
              {
                internalType: "uint64",
                name: "createdAt",
                type: "uint64",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
            ],
            name: "hasProfile",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "namehash",
                type: "bytes32",
              },
            ],
            name: "linkENS",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "nextProfileId",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "profileOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "nickname",
                type: "string",
              },
            ],
            name: "setAppNickname",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "newURI",
                type: "string",
              },
            ],
            name: "setMetadataURI",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "newHandle",
                type: "string",
              },
            ],
            name: "setVerseHandle",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnershipOfProfile",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "nickname",
                type: "string",
              },
            ],
            name: "verseIdByAppNickname",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "handle",
                type: "string",
              },
            ],
            name: "verseIdByHandle",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreJobBoardProxy: {
        address: "0xab50759b8B6565b05E25CeA78175b59B65e9965f",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreJobManagerProxy: {
        address: "0x2D12e51Ec5846e3F25524c8695f583AB482Fe4E0",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreScoreModelProxy: {
        address: "0x08d1324535c07c600bCfD31f60cD3E96fD23211f",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      AppRegistryProxy: {
        address: "0xC65ba4e00e4E26eb9B913d1aBCa39CE609375D77",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      BadgeRegistryProxy: {
        address: "0xbAFE479Ea9c432D5bF6C097b72f84Fb3a1298477",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      ReputationHubProxy: {
        address: "0xE71BC440C550935Bcc2A16BC4AB57e4a12eb1AA6",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      ScoreAggregatorProxy: {
        address: "0x1a87342AD11B271d275187efAC3FCA1aAB807167",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      VerseProfileProxy: {
        address: "0xB31795e04A05f10e459790dC3f6a38Cd1Ea0A1e0",
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_logic",
                type: "address",
              },
              {
                internalType: "address",
                name: "initialOwner",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
              },
            ],
            stateMutability: "payable",
            type: "constructor",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "ERC1967InvalidAdmin",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "ProxyDeniedAdminAccess",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
              },
            ],
            name: "AdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            stateMutability: "payable",
            type: "fallback",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreJobBoard: {
        address: "0xab50759b8B6565b05E25CeA78175b59B65e9965f",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "AddressInsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "ReentrancyGuardReentrantCall",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "SafeERC20FailedOperation",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "ApplicationAccepted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "worker",
                type: "address",
              },
            ],
            name: "ApplicationWithdrawn",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "bid",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
            ],
            name: "Applied",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
            ],
            name: "PostClosed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "budgetMax",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint64",
                name: "expiry",
                type: "uint64",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "deposit",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
            ],
            name: "PostCreated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "PostDepositSlashed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
            ],
            name: "PostExpired",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "postId",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "appIndex",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "worker",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "paymentToken",
                    type: "address",
                  },
                  {
                    internalType: "uint64",
                    name: "deadline",
                    type: "uint64",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "enum IJobManager.JobType",
                    name: "jobType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256[]",
                    name: "amounts",
                    type: "uint256[]",
                  },
                  {
                    internalType: "uint64[]",
                    name: "dueDates",
                    type: "uint64[]",
                  },
                  {
                    internalType: "bool[]",
                    name: "requiresDeliverable",
                    type: "bool[]",
                  },
                ],
                internalType: "struct HireCoreJobBoard.AcceptParams",
                name: "params",
                type: "tuple",
              },
            ],
            name: "accept",
            outputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "applications",
            outputs: [
              {
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "bidAmount",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
              {
                internalType: "bool",
                name: "withdrawn",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "bidAmount",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
            ],
            name: "applyNow",
            outputs: [
              {
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            name: "close",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "coreToken",
            outputs: [
              {
                internalType: "contract IERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "budgetMax",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "duration",
                type: "uint64",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
            ],
            name: "createPost",
            outputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            name: "expire",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
            ],
            name: "getApplication",
            outputs: [
              {
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "bidAmount",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "proposalURI",
                type: "string",
              },
              {
                internalType: "bool",
                name: "withdrawn",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
            ],
            name: "getApplicationsCount",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "jobManager_",
                type: "address",
              },
              {
                internalType: "address",
                name: "coreToken_",
                type: "address",
              },
              {
                internalType: "address",
                name: "treasury_",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "minDeposit_",
                type: "uint256",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "jobManager",
            outputs: [
              {
                internalType: "contract IJobManager",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "minDeposit",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "nextPostId",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "posts",
            outputs: [
              {
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "budgetMax",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "expiry",
                type: "uint64",
              },
              {
                internalType: "uint256",
                name: "deposit",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "bool",
                name: "open",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newCoreToken",
                type: "address",
              },
            ],
            name: "setCoreToken",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newJobManager",
                type: "address",
              },
            ],
            name: "setJobManager",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "newDeposit",
                type: "uint256",
              },
            ],
            name: "setMinDeposit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "setTreasury",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "treasury",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "postId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "appIndex",
                type: "uint256",
              },
            ],
            name: "withdraw",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreJobManager: {
        address: "0x2D12e51Ec5846e3F25524c8695f583AB482Fe4E0",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "AddressInsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "EnforcedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "ExpectedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "ReentrancyGuardReentrantCall",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "SafeERC20FailedOperation",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "badgeRegistry",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256[]",
                name: "tierBadgeIds",
                type: "uint256[]",
              },
            ],
            name: "BadgeRegistryUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint16",
                name: "baseFeeBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "workerDiscountBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "hirerDiscountBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "uint8",
                name: "minTier",
                type: "uint8",
              },
            ],
            name: "FeesUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "refund",
                type: "uint256",
              },
            ],
            name: "JobCancelled",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                indexed: false,
                internalType: "enum HireCoreJobManager.JobType",
                name: "jobType",
                type: "uint8",
              },
              {
                indexed: false,
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "totalAmount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "feeBps",
                type: "uint16",
              },
            ],
            name: "JobCreated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "reason",
                type: "string",
              },
            ],
            name: "JobDisputed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "fundedTotal",
                type: "uint256",
              },
            ],
            name: "JobFunded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "workerPayout",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "hirerRefund",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "feeTaken",
                type: "uint256",
              },
            ],
            name: "JobResolved",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "newURI",
                type: "string",
              },
            ],
            name: "MetadataURIUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "deliverableURI",
                type: "string",
              },
              {
                indexed: false,
                internalType: "string",
                name: "note",
                type: "string",
              },
            ],
            name: "MilestoneDelivered",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "netToWorker",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "feeToTreasury",
                type: "uint256",
              },
            ],
            name: "MilestoneReleased",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "bool",
                name: "enabled",
                type: "bool",
              },
            ],
            name: "NativeToggle",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Paused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "hub",
                type: "address",
              },
            ],
            name: "ReputationHubSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "allowed",
                type: "bool",
              },
            ],
            name: "TokenAllowed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "TreasuryUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Unpaused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "verseProfile",
                type: "address",
              },
            ],
            name: "VerseProfileSet",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "RESOLVER_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "bool",
                name: "allowed",
                type: "bool",
              },
            ],
            name: "allowPaymentToken",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "allowedPaymentToken",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "badgeRegistry",
            outputs: [
              {
                internalType: "contract IBadgeRegistry",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "baseFeeBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "cancelJob",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                components: [
                  {
                    internalType: "address",
                    name: "worker",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "paymentToken",
                    type: "address",
                  },
                  {
                    internalType: "uint64",
                    name: "deadline",
                    type: "uint64",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "enum HireCoreJobManager.JobType",
                    name: "jobType",
                    type: "uint8",
                  },
                  {
                    internalType: "uint256[]",
                    name: "amounts",
                    type: "uint256[]",
                  },
                  {
                    internalType: "uint64[]",
                    name: "dueDates",
                    type: "uint64[]",
                  },
                  {
                    internalType: "bool[]",
                    name: "requiresDeliverable",
                    type: "bool[]",
                  },
                ],
                internalType: "struct HireCoreJobManager.CreateJobParams",
                name: "p",
                type: "tuple",
              },
            ],
            name: "createJob",
            outputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "deliverableURI",
                type: "string",
              },
              {
                internalType: "string",
                name: "note",
                type: "string",
              },
            ],
            name: "deliverMilestone",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "reason",
                type: "string",
              },
            ],
            name: "disputeJob",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "fundJob",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "fundJobNative",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
            ],
            name: "fundJobWithPermit",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
            ],
            name: "getJobCore",
            outputs: [
              {
                internalType: "address",
                name: "hirer",
                type: "address",
              },
              {
                internalType: "address",
                name: "worker",
                type: "address",
              },
              {
                internalType: "address",
                name: "paymentToken",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "totalAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "fundedAmount",
                type: "uint256",
              },
              {
                internalType: "uint16",
                name: "feeBpsAtCreation",
                type: "uint16",
              },
              {
                internalType: "enum HireCoreJobManager.JobStatus",
                name: "status",
                type: "uint8",
              },
              {
                internalType: "enum HireCoreJobManager.JobType",
                name: "jobType",
                type: "uint8",
              },
              {
                internalType: "uint64",
                name: "createdAt",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "deadline",
                type: "uint64",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "milestonesCount",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "index",
                type: "uint256",
              },
            ],
            name: "getMilestone",
            outputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "dueDate",
                type: "uint64",
              },
              {
                internalType: "bool",
                name: "delivered",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "released",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "requiresDeliverable",
                type: "bool",
              },
              {
                internalType: "string",
                name: "deliverableURI",
                type: "string",
              },
              {
                internalType: "string",
                name: "note",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "hirerDiscountBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "treasury_",
                type: "address",
              },
              {
                internalType: "address",
                name: "verseProfile_",
                type: "address",
              },
              {
                internalType: "address",
                name: "reputationHub_",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "baseFeeBps_",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "maxFeeBps_",
                type: "uint16",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "maxFeeBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "minTierForDiscount",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "nativePaymentsEnabled",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "nextJobId",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "milestoneIndex",
                type: "uint256",
              },
            ],
            name: "releaseMilestone",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "reputationHub",
            outputs: [
              {
                internalType: "contract IVerseReputationHub",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "workerPayout",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "hirerRefund",
                type: "uint256",
              },
            ],
            name: "resolveDispute",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "reg",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
            ],
            name: "setBadgeRegistry",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint16",
                name: "baseFeeBps_",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "workerDiscountBps_",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "hirerDiscountBps_",
                type: "uint16",
              },
              {
                internalType: "uint8",
                name: "minTier_",
                type: "uint8",
              },
            ],
            name: "setFees",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint16",
                name: "maxFeeBps_",
                type: "uint16",
              },
            ],
            name: "setMaxFeeBps",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "hub",
                type: "address",
              },
            ],
            name: "setReputationHub",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newTreasury",
                type: "address",
              },
            ],
            name: "setTreasury",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "vp",
                type: "address",
              },
            ],
            name: "setVerseProfile",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "tierBadgeIds",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bool",
                name: "enabled",
                type: "bool",
              },
            ],
            name: "toggleNative",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "treasury",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "jobId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "newURI",
                type: "string",
              },
            ],
            name: "updateJobMetadataURI",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [],
            name: "verseProfile",
            outputs: [
              {
                internalType: "contract IVerseProfile",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "workerDiscountBps",
            outputs: [
              {
                internalType: "uint16",
                name: "",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            stateMutability: "payable",
            type: "receive",
          },
        ],
        deployedOnBlock: 0,
      },
      HireCoreScoreModel: {
        address: "0x08d1324535c07c600bCfD31f60cD3E96fD23211f",
        abi: [
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "hub",
                type: "address",
              },
            ],
            name: "HubSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint256",
                name: "completedWeight",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "cancelledPenalty",
                type: "uint256",
              },
            ],
            name: "WeightsUpdated",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "APP_ID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "cancelledPenalty",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "completedWeight",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "hub",
            outputs: [
              {
                internalType: "contract IVerseReputationHub",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "hub_",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "scoreOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "hub_",
                type: "address",
              },
            ],
            name: "setHub",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "completedWeight_",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "cancelledPenalty_",
                type: "uint256",
              },
            ],
            name: "setWeights",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      AppRegistry: {
        address: "0xC65ba4e00e4E26eb9B913d1aBCa39CE609375D77",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "AppActiveUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "newName",
                type: "string",
              },
            ],
            name: "AppNameUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                indexed: false,
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "AppRegistered",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "AppRemoved",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
            ],
            name: "AppScoreModelUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                indexed: false,
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "AppUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "AppWeightUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "address",
                name: "writer",
                type: "address",
              },
            ],
            name: "AppWriterUpdated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "allAppIds",
            outputs: [
              {
                internalType: "bytes32[]",
                name: "",
                type: "bytes32[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "appConfigOf",
            outputs: [
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "appIds",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "computeAppScore",
            outputs: [
              {
                internalType: "uint256",
                name: "rawScore",
                type: "uint256",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getApp",
            outputs: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "writer",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "scoreModel",
                    type: "address",
                  },
                  {
                    internalType: "uint16",
                    name: "weightBps",
                    type: "uint16",
                  },
                  {
                    internalType: "bool",
                    name: "active",
                    type: "bool",
                  },
                ],
                internalType: "struct VerseAppRegistry.App",
                name: "",
                type: "tuple",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "isActive",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "candidate",
                type: "address",
              },
            ],
            name: "isWriter",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "registerApp",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "removeApp",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "setAppActive",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "newName",
                type: "string",
              },
            ],
            name: "setAppName",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
            ],
            name: "setAppScoreModel",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
            ],
            name: "setAppWeight",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
            ],
            name: "setAppWriter",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "writer",
                type: "address",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
            ],
            name: "updateApp",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      BadgeRegistry: {
        address: "0xbAFE479Ea9c432D5bF6C097b72f84Fb3a1298477",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "ERC1155InsufficientBalance",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "approver",
                type: "address",
              },
            ],
            name: "ERC1155InvalidApprover",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "idsLength",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "valuesLength",
                type: "uint256",
              },
            ],
            name: "ERC1155InvalidArrayLength",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
            ],
            name: "ERC1155InvalidOperator",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "receiver",
                type: "address",
              },
            ],
            name: "ERC1155InvalidReceiver",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "ERC1155InvalidSender",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "ERC1155MissingApprovalForAll",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "EnforcedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "ExpectedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "approved",
                type: "bool",
              },
            ],
            name: "ApprovalForAll",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
              },
            ],
            name: "BadgeMinted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "newExpiry",
                type: "uint256",
              },
            ],
            name: "BadgeRenewed",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "BadgeRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Paused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "bool",
                name: "isSoulbound",
                type: "bool",
              },
            ],
            name: "SoulboundSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint8",
                name: "tier",
                type: "uint8",
              },
            ],
            name: "TierSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
              {
                indexed: false,
                internalType: "uint256[]",
                name: "values",
                type: "uint256[]",
              },
            ],
            name: "TransferBatch",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            name: "TransferSingle",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "string",
                name: "value",
                type: "string",
              },
              {
                indexed: true,
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
            ],
            name: "URI",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Unpaused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "MINTER_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "REVOKER_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "badgeTier",
            outputs: [
              {
                internalType: "uint8",
                name: "",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address[]",
                name: "accounts",
                type: "address[]",
              },
              {
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
            ],
            name: "balanceOfBatch",
            outputs: [
              {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "expiryOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "badgeIds",
                type: "uint256[]",
              },
            ],
            name: "hasAny",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "hasBadge",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "string",
                name: "baseURI",
                type: "string",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
            ],
            name: "isApprovedForAll",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expiry",
                type: "uint256",
              },
            ],
            name: "mintBadge",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "newExpiry",
                type: "uint256",
              },
            ],
            name: "renewBadge",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "revokeBadge",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "ids",
                type: "uint256[]",
              },
              {
                internalType: "uint256[]",
                name: "values",
                type: "uint256[]",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "safeBatchTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address[]",
                name: "tos",
                type: "address[]",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
            ],
            name: "safeBatchTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "from",
                type: "address",
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "safeTransferFrom",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
            ],
            name: "selfBurn",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "operator",
                type: "address",
              },
              {
                internalType: "bool",
                name: "approved",
                type: "bool",
              },
            ],
            name: "setApprovalForAll",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "uint8",
                name: "tier",
                type: "uint8",
              },
            ],
            name: "setBadgeTier",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "badgeId",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isSoulbound",
                type: "bool",
              },
            ],
            name: "setSoulbound",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "newuri",
                type: "string",
              },
            ],
            name: "setURI",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "soulbound",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
              {
                internalType: "uint256[]",
                name: "considerIds",
                type: "uint256[]",
              },
            ],
            name: "tierOf",
            outputs: [
              {
                internalType: "uint8",
                name: "tier",
                type: "uint8",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            name: "uri",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      ReputationHub: {
        address: "0xE71BC440C550935Bcc2A16BC4AB57e4a12eb1AA6",
        abi: [
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "action",
                type: "string",
              },
              {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "ActivityLogged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "registry",
                type: "address",
              },
            ],
            name: "RegistrySet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "appRegistry",
            outputs: [
              {
                internalType: "contract IVerseAppRegistry",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
            ],
            name: "getActivity",
            outputs: [
              {
                internalType: "uint64",
                name: "completed",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "cancelled",
                type: "uint64",
              },
              {
                internalType: "uint256",
                name: "earned",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getRawCounts",
            outputs: [
              {
                internalType: "uint64",
                name: "completed",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "cancelled",
                type: "uint64",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "appRegistry_",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "logCancelled",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "logCompleted",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newRegistry",
                type: "address",
              },
            ],
            name: "setAppRegistry",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      ScoreAggregator: {
        address: "0x1a87342AD11B271d275187efAC3FCA1aAB807167",
        abi: [
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "registry",
                type: "address",
              },
            ],
            name: "RegistrySet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "appScore",
            outputs: [
              {
                internalType: "uint256",
                name: "raw",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "weighted",
                type: "uint256",
              },
              {
                internalType: "uint16",
                name: "weightBps",
                type: "uint16",
              },
              {
                internalType: "bool",
                name: "active",
                type: "bool",
              },
              {
                internalType: "address",
                name: "scoreModel",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "fullScore",
            outputs: [
              {
                internalType: "uint256",
                name: "total",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "bytes32",
                    name: "appId",
                    type: "bytes32",
                  },
                  {
                    internalType: "uint256",
                    name: "rawScore",
                    type: "uint256",
                  },
                  {
                    internalType: "uint16",
                    name: "weightBps",
                    type: "uint16",
                  },
                  {
                    internalType: "uint256",
                    name: "weightedScore",
                    type: "uint256",
                  },
                  {
                    internalType: "bool",
                    name: "active",
                    type: "bool",
                  },
                  {
                    internalType: "address",
                    name: "scoreModel",
                    type: "address",
                  },
                ],
                internalType: "struct VerseScoreAggregator.AppPart[]",
                name: "parts",
                type: "tuple[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "globalScore",
            outputs: [
              {
                internalType: "uint256",
                name: "total",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
              {
                internalType: "address",
                name: "registry_",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "registry",
            outputs: [
              {
                internalType: "contract IVerseAppRegistry",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newRegistry",
                type: "address",
              },
            ],
            name: "setRegistry",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
      VerseProfile: {
        address: "0xB31795e04A05f10e459790dC3f6a38Cd1Ea0A1e0",
        abi: [
          {
            inputs: [],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [],
            name: "AccessControlBadConfirmation",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "neededRole",
                type: "bytes32",
              },
            ],
            name: "AccessControlUnauthorizedAccount",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "target",
                type: "address",
              },
            ],
            name: "AddressEmptyCode",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "ERC1967InvalidImplementation",
            type: "error",
          },
          {
            inputs: [],
            name: "ERC1967NonPayable",
            type: "error",
          },
          {
            inputs: [],
            name: "EnforcedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "ExpectedPause",
            type: "error",
          },
          {
            inputs: [],
            name: "FailedInnerCall",
            type: "error",
          },
          {
            inputs: [],
            name: "InvalidInitialization",
            type: "error",
          },
          {
            inputs: [],
            name: "NotInitializing",
            type: "error",
          },
          {
            inputs: [],
            name: "UUPSUnauthorizedCallContext",
            type: "error",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "slot",
                type: "bytes32",
              },
            ],
            name: "UUPSUnsupportedProxiableUUID",
            type: "error",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                indexed: false,
                internalType: "string",
                name: "nickname",
                type: "string",
              },
            ],
            name: "AppNicknameSet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "bytes32",
                name: "namehash",
                type: "bytes32",
              },
            ],
            name: "ENSLinked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
              },
            ],
            name: "Initialized",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "uri",
                type: "string",
              },
            ],
            name: "MetadataURISet",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "OwnerChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Paused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                indexed: false,
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
            ],
            name: "ProfileCreated",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
              },
            ],
            name: "RoleAdminChanged",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleGranted",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
              },
              {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
              },
            ],
            name: "RoleRevoked",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: false,
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "Unpaused",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            name: "Upgraded",
            type: "event",
          },
          {
            anonymous: false,
            inputs: [
              {
                indexed: true,
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                indexed: false,
                internalType: "string",
                name: "handle",
                type: "string",
              },
            ],
            name: "VerseHandleSet",
            type: "event",
          },
          {
            inputs: [],
            name: "ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "DEFAULT_ADMIN_ROLE",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "UPGRADE_INTERFACE_VERSION",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "verseHandle",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "bytes32",
                name: "ensNamehash",
                type: "bytes32",
              },
            ],
            name: "createProfile",
            outputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getAppNickname",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
            ],
            name: "getDisplayHandle",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
            ],
            name: "getProfile",
            outputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "string",
                name: "verseHandle",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "bytes32",
                name: "ensNamehash",
                type: "bytes32",
              },
              {
                internalType: "uint64",
                name: "createdAt",
                type: "uint64",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
            ],
            name: "getRoleAdmin",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "user",
                type: "address",
              },
            ],
            name: "hasProfile",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "hasRole",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "admin",
                type: "address",
              },
            ],
            name: "initialize",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "namehash",
                type: "bytes32",
              },
            ],
            name: "linkENS",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "nextProfileId",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "pause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "paused",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            name: "profileOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "proxiableUUID",
            outputs: [
              {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "callerConfirmation",
                type: "address",
              },
            ],
            name: "renounceRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "revokeRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "nickname",
                type: "string",
              },
            ],
            name: "setAppNickname",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "newURI",
                type: "string",
              },
            ],
            name: "setMetadataURI",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "newHandle",
                type: "string",
              },
            ],
            name: "setVerseHandle",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes4",
                name: "interfaceId",
                type: "bytes4",
              },
            ],
            name: "supportsInterface",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "verseId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "newOwner",
                type: "address",
              },
            ],
            name: "transferOwnershipOfProfile",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "unpause",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "address",
                name: "newImplementation",
                type: "address",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            name: "upgradeToAndCall",
            outputs: [],
            stateMutability: "payable",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "bytes32",
                name: "appId",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "nickname",
                type: "string",
              },
            ],
            name: "verseIdByAppNickname",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              {
                internalType: "string",
                name: "handle",
                type: "string",
              },
            ],
            name: "verseIdByHandle",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        deployedOnBlock: 0,
      },
    },
  },
} as const;

export type DeployedContracts = typeof deployedContracts;
