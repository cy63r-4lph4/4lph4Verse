/**
 * Verse Wallet — Off-Chain Address Derivation — ⚠️ UNVERIFIED
 *
 * This module implements the CREATE2 address derivation formula
 * modeled after KernelFactory.sol (v3.1) source code.
 *
 * STATUS: UNVERIFIED. The ERC1967 proxy creation code is a PLACEHOLDER.
 * This module MUST NOT be treated as producing correct addresses until:
 *   1. The real proxy bytecode hash is substituted from ZeroDev's deployment registry
 *   2. A testnet deployment on Base Sepolia confirms computed address == on-chain address
 *
 * ── KernelFactory.sol (line 25) ──────────────────────────────────────────
 *   actualSalt = keccak256(abi.encodePacked(data, salt))
 *   address    = CREATE2(factory, actualSalt, keccak256(type(ERC1967Proxy).creationCode))
 *
 * ── Verse Input Salt Formula ─────────────────────────────────────────────
 *   verseInputSalt = keccak256(
 *     keccak256("verse.v1")  ||  // DOMAIN_SEPARATOR
 *     bytes32(VERSION = 1)   ||  // DERIVATION_VERSION
 *     walletIdentityId        ||  // 32-byte identity anchor (immutable)
 *     bytes32(accountIndex)       // 0 for primary account
 *   )
 *
 * ── walletIdentityId ────────────────────────────────────────────────────
 *   walletIdentityId = keccak256("verse.wallet.identity.v1" || walletIdentitySeed)
 *   (walletIdentitySeed is 32 secure random bytes, NEVER stored by backend)
 *
 * ── INV-21 ──────────────────────────────────────────────────────────────
 *   The actual salt passed to KernelFactory.createAccount is:
 *   keccak256(abi.encodePacked(initCalldata, verseInputSalt))
 *   NOT just the verseInputSalt alone.
 *
 * ── INV-25 ──────────────────────────────────────────────────────────────
 *   The counterfactual address depends on BOTH walletIdentityId AND the
 *   initial controller's public key (via initCalldata). This is required
 *   for front-running protection. The address is stable AFTER deployment.
 */

import {
  keccak256,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  getContractAddress,
  concat,
  toBytes,
  toHex,
  type Address,
  type Hex,
} from 'viem';
import {
  VERSE_DOMAIN_SEPARATOR,
  DERIVATION_VERSION,
  WALLET_IDENTITY_DOMAIN,
} from './constants';

// ────────────────────────────────────────────────────────────────────────────
// Kernel ABI (minimal — only what we need for derivation)
// ────────────────────────────────────────────────────────────────────────────

const KERNEL_INITIALIZE_ABI = [
  {
    name: 'initialize',
    type: 'function',
    inputs: [
      { name: '_rootValidator', type: 'bytes21' },
      { name: 'hook', type: 'address' },
      { name: 'validatorData', type: 'bytes' },
      { name: 'hookData', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

/**
 * ERC-1967 proxy creation code template.
 *
 * ⚠️ UNVERIFIED PLACEHOLDER. This is NOT the actual bytecode used by the
 * deployed KernelFactory. The address derivation output is NOT correct until
 * the real bytecode is substituted from ZeroDev's deployment registry.
 *
 * Pre-implementation checklist: fetch the exact ERC1967Proxy creation code
 * for each target chain before activating any chain.
 */
const ERC1967_PROXY_CREATION_CODE_PREFIX: Hex =
  '0x60806040526040516104e73803806104e7833981016040819052610023916100d9565b61002f82826000610036565b50506101b3565b61003f83610061565b60008251118061004c5750805b1561005c5761005a83836100a1565b505b505050565b610066816100cd565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606100c6838360405180606001604052806027815260200161046060279139610188565b9392505050565b803b6100e85760006000fd5b50565b600080604083850312156100ec57600080fd5b82516001600160a01b038116811461010357600080fd5b602084015190925067ffffffffffffffff8082111561012157600080fd5b818501915085601f83011261013557600080fd5b81518181111561014757610147610199565b604051601f8201601f19908116603f0116810190838211818310171561016f5761016f610199565b8160405282815288602084870101111561018857600080fd5b6101998360208301602088016101af565b80955050505050509250929050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156101ca5781810151838201526020016101b2565b50506000910152565b610304806101e26000396000f3fe';

// ────────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────────

/**
 * Parameters for computing a Verse Wallet counterfactual address.
 */
export interface ComputeWalletAddressParams {
  /** The 32-byte wallet identity (0x-prefixed hex), computed from walletIdentitySeed. */
  walletIdentityId: Hex;

  /** The account index (0 = primary account). */
  accountIndex: number;

  /**
   * The P-256 public key X coordinate of the initial passkey.
   * This is the key used as the Kernel root validator at deployment.
   */
  initialPasskeyX: bigint;

  /**
   * The P-256 public key Y coordinate of the initial passkey.
   */
  initialPasskeyY: bigint;

  /** Address of the WebAuthn/passkey validator module on the target chain. */
  passkeyValidatorAddress: Address;

  /** Address of the KernelFactory on the target chain. */
  kernelFactoryAddress: Address;

  /** Address of the Kernel v3.1 implementation on the target chain. */
  kernelImplAddress: Address;
}

/**
 * Computes the Verse Input Salt.
 *
 * Formula:
 *   keccak256(keccak256(DOMAIN_SEP) || bytes32(VERSION) || walletIdentityId || bytes32(accountIndex))
 *
 * This is the `salt` parameter passed to `KernelFactory.createAccount(data, salt)`.
 * The factory then combines it with `data` to produce the actual CREATE2 salt.
 */
export function computeVerseInputSalt(
  walletIdentityId: Hex,
  accountIndex: number,
): Hex {
  const domainSepHash = keccak256(toHex(VERSE_DOMAIN_SEPARATOR));

  return keccak256(
    encodeAbiParameters(
      [
        { type: 'bytes32' }, // keccak256(DOMAIN_SEPARATOR)
        { type: 'bytes32' }, // VERSION
        { type: 'bytes32' }, // walletIdentityId
        { type: 'uint256' }, // accountIndex
      ],
      [
        domainSepHash,
        toHex(DERIVATION_VERSION, { size: 32 }),
        walletIdentityId,
        BigInt(accountIndex),
      ],
    ),
  );
}

/**
 * Encodes the Kernel ValidationId for the passkey validator.
 *
 * Kernel v3 encodes validators as: bytes21 = bytes1(validatorType) || address(validatorContract)
 * The validator type for a 'sudo' (root) validator module is 0x01.
 *
 * Reference: Kernel v3.1 ValidationManager.sol
 */
export function encodeValidationId(validatorAddress: Address): Hex {
  // bytes1(0x01) = VALIDATION_TYPE_MODULE (sudo validator)
  return concat(['0x01', validatorAddress]) as Hex;
}

/**
 * Encodes the initCalldata for Kernel.initialize().
 *
 * This is the `data` parameter passed to `KernelFactory.createAccount(data, salt)`.
 * It is also part of the CREATE2 salt (via keccak256(data || salt) in the factory).
 *
 * INV-25: Changing the initial passkey public key changes this data → changes the address.
 */
export function encodeKernelInitCalldata(params: {
  passkeyValidatorAddress: Address;
  initialPasskeyX: bigint;
  initialPasskeyY: bigint;
}): Hex {
  const rootValidatorId = encodeValidationId(params.passkeyValidatorAddress);

  // The passkey validator expects: abi.encode(uint256 x, uint256 y)
  const validatorData = encodeAbiParameters(
    [{ type: 'uint256' }, { type: 'uint256' }],
    [params.initialPasskeyX, params.initialPasskeyY],
  );

  return encodeFunctionData({
    abi: KERNEL_INITIALIZE_ABI,
    functionName: 'initialize',
    args: [
      rootValidatorId as `0x${string}`,
      '0x0000000000000000000000000000000000000000', // no hook
      validatorData,
      '0x', // no hook data
    ],
  });
}

/**
 * ⚠️ UNVERIFIED — Computes the proxy bytecode hash for CREATE2 address derivation.
 *
 * Uses PLACEHOLDER bytecode. Output is not correct for production.
 *
 * The ERC1967Proxy creation code is:
 *   creationCode || abi.encode(kernelImplAddress, initCalldata)
 *
 * The KernelFactory deploys the proxy with this bytecode, then the proxy
 * constructor calls Kernel.initialize() synchronously (atomic deploy + init).
 */
export function computeProxyBytecodeHash(
  kernelImplAddress: Address,
  initCalldata: Hex,
): Hex {
  // Proxy constructor args: abi.encode(address implementation, bytes initData)
  const constructorArgs = encodeAbiParameters(
    [{ type: 'address' }, { type: 'bytes' }],
    [kernelImplAddress, initCalldata],
  );

  const fullBytecode = concat([ERC1967_PROXY_CREATION_CODE_PREFIX, constructorArgs]);
  return keccak256(fullBytecode);
}

/**
 * ⚠️ UNVERIFIED — Computes the deterministic counterfactual address of a Verse Smart Account.
 *
 * Implements the formula from Architecture v6 §5, modeled after
 * KernelFactory.sol line 25.
 *
 * UNVERIFIED: The proxy bytecode is a placeholder. The address returned by this
 * function is NOT confirmed to match any on-chain deployment. Do not use this
 * output as authoritative until testnet verification is complete.
 *
 * The address is stable AFTER deployment (INV-23). Before deployment, changing the
 * initial passkey changes the address (INV-25, required for front-running protection).
 *
 * @returns The checksummed Ethereum address of the smart account.
 */
export function computeWalletAddress(params: ComputeWalletAddressParams): Address {
  // 1. Compute the Verse-protocol input salt from walletIdentityId + accountIndex
  const verseInputSalt = computeVerseInputSalt(
    params.walletIdentityId,
    params.accountIndex,
  );

  // 2. Encode the Kernel initialization calldata (data parameter for createAccount)
  const initCalldata = encodeKernelInitCalldata({
    passkeyValidatorAddress: params.passkeyValidatorAddress,
    initialPasskeyX: params.initialPasskeyX,
    initialPasskeyY: params.initialPasskeyY,
  });

  // 3. Replicate KernelFactory.createAccount's actual salt formula (line 25):
  //    actualSalt = keccak256(abi.encodePacked(data, salt))
  //    INV-21: This is the correct formula — NOT just verseInputSalt alone.
  const actualSalt = keccak256(
    encodePacked(['bytes', 'bytes32'], [initCalldata, verseInputSalt]),
  );

  // 4. Compute the proxy bytecode hash (deterministic for identical impl + initData)
  const bytecodeHash = computeProxyBytecodeHash(
    params.kernelImplAddress,
    initCalldata,
  );

  // 5. Apply the CREATE2 formula: address = keccak256(0xff || factory || salt || bytecodeHash)[12:]
  return getContractAddress({
    from: params.kernelFactoryAddress,
    salt: actualSalt,
    bytecodeHash,
    opcode: 'CREATE2',
  });
}

/**
 * Derives a walletIdentityId from a raw seed.
 *
 * walletIdentityId = keccak256("verse.wallet.identity.v1" || walletIdentitySeed)
 *
 * The seed is 32 secure random bytes and MUST NEVER be stored by the backend.
 * It lives in MPC/passkey secure enclave infrastructure.
 *
 * INV-01: walletIdentityId is immutable after creation.
 * INV-04: walletIdentitySeed MUST NEVER be stored in plaintext.
 */
export function deriveWalletIdentityId(walletIdentitySeed: Uint8Array): Hex {
  if (walletIdentitySeed.length !== 32) {
    throw new Error(
      `walletIdentitySeed must be exactly 32 bytes, got ${walletIdentitySeed.length}`,
    );
  }

  const domain = toBytes(WALLET_IDENTITY_DOMAIN as string);
  const combined = concat([domain, walletIdentitySeed]);
  return keccak256(combined);
}

// Re-export constants for convenience
export { VERSE_DOMAIN_SEPARATOR, DERIVATION_VERSION } from './constants';
