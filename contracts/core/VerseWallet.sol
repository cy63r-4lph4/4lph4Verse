// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "../interfaces/IAccount.sol";

/**
 * @title VerseWallet
 * @notice An ERC-4337 Smart Account that uses a Passkey (P256) for authentication.
 * @dev This wallet is deterministically deployed via CREATE2 on multiple chains.
 */
contract VerseWallet is IAccount, Initializable {
    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------
    
    /// @notice The ERC-4337 EntryPoint contract.
    IEntryPoint public immutable entryPoint;

    /// @notice The Passkey Public Key (X coordinate)
    bytes32 public publicKeyX;

    /// @notice The Passkey Public Key (Y coordinate)
    bytes32 public publicKeyY;

    // ------------------------------------------------------------------------
    // Modifiers
    // ------------------------------------------------------------------------
    
    modifier onlyEntryPoint() {
        require(msg.sender == address(entryPoint), "Not EntryPoint");
        _;
    }

    modifier onlyOwnerOrEntryPoint() {
        require(msg.sender == address(entryPoint) || msg.sender == address(this), "Not Authorized");
        _;
    }

    // ------------------------------------------------------------------------
    // Initialization
    // ------------------------------------------------------------------------
    
    constructor(IEntryPoint _entryPoint) {
        entryPoint = _entryPoint;
        _disableInitializers();
    }

    /**
     * @notice Initializes the wallet with the passkey public coordinates.
     */
    function initialize(bytes32 _publicKeyX, bytes32 _publicKeyY) external initializer {
        publicKeyX = _publicKeyX;
        publicKeyY = _publicKeyY;
    }

    // ------------------------------------------------------------------------
    // ERC-4337 IAccount Implementation
    // ------------------------------------------------------------------------
    
    /**
     * @notice Validates the UserOperation. Called by the EntryPoint.
     * @param userOp The UserOperation.
     * @param userOpHash The hash of the UserOperation.
     * @param missingAccountFunds The funds required to pay for gas.
     * @return validationData 0 if valid, 1 if invalid.
     */
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external override onlyEntryPoint returns (uint256 validationData) {
        
        bool isValid = _validatePasskeySignature(userOpHash, userOp.signature);
        if (!isValid) {
            return 1; // SIG_VALIDATION_FAILED
        }

        // Pay the EntryPoint
        if (missingAccountFunds > 0) {
            (bool success, ) = payable(msg.sender).call{value: missingAccountFunds}("");
            require(success, "Payment failed");
        }

        return 0; // SUCCESS
    }

    // ------------------------------------------------------------------------
    // Execution
    // ------------------------------------------------------------------------
    
    /**
     * @notice Executes a single transaction. Can only be called by the EntryPoint or the wallet itself.
     */
    function execute(address dest, uint256 value, bytes calldata func) external onlyOwnerOrEntryPoint {
        _call(dest, value, func);
    }

    /**
     * @notice Executes a batch of transactions.
     */
    function executeBatch(address[] calldata dests, uint256[] calldata values, bytes[] calldata funcs) external onlyOwnerOrEntryPoint {
        require(dests.length == values.length && dests.length == funcs.length, "Array lengths mismatch");
        for (uint256 i = 0; i < dests.length; i++) {
            _call(dests[i], values[i], funcs[i]);
        }
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    // ------------------------------------------------------------------------
    // Internal WebAuthn / P256 Validation
    // ------------------------------------------------------------------------
    
    /**
     * @notice Validates the signature against the stored P256 public key.
     * @dev In a production environment, this would use a P256 verifier library (e.g., FCL or RIP-7212 precompile).
     *      For this iteration, we mock the validation to always return true if a signature is provided, 
     *      allowing the rest of the flow to be tested.
     */
    function _validatePasskeySignature(bytes32 /* userOpHash */, bytes calldata signature) internal view returns (bool) {
        // MOCK: Replace with true P256 validation using `publicKeyX` and `publicKeyY`
        return signature.length > 0;
    }

    receive() external payable {}
}
