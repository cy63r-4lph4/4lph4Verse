// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract VerseWalletFactory {
    address public immutable walletImplementation;

    event WalletCreated(address indexed wallet, bytes32 salt);

    constructor(address _walletImplementation) {
        require(_walletImplementation != address(0), "Invalid implementation");
        walletImplementation = _walletImplementation;
    }

    /**
     * @notice Deploys a new VerseWallet using CREATE2 for deterministic addresses.
     * @param publicKeyX The X coordinate of the passkey public key.
     * @param publicKeyY The Y coordinate of the passkey public key.
     */
    function createAccount(bytes32 publicKeyX, bytes32 publicKeyY) public returns (address ret) {
        bytes32 salt = keccak256(abi.encodePacked(publicKeyX, publicKeyY));
        address computedAddress = getAddress(publicKeyX, publicKeyY);

        // If the wallet already exists, return its address
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(computedAddress)
        }
        if (codeSize > 0) {
            return computedAddress;
        }

        // Deploy the ERC1967 proxy pointing to our implementation
        bytes memory proxyCreationCode = abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(
                walletImplementation,
                abi.encodeWithSignature("initialize(bytes32,bytes32)", publicKeyX, publicKeyY)
            )
        );

        assembly {
            ret := create2(0, add(proxyCreationCode, 0x20), mload(proxyCreationCode), salt)
            if iszero(extcodesize(ret)) {
                revert(0, 0)
            }
        }
        
        emit WalletCreated(ret, salt);
    }

    /**
     * @notice Computes the deterministic address of a VerseWallet.
     */
    function getAddress(bytes32 publicKeyX, bytes32 publicKeyY) public view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(publicKeyX, publicKeyY));
        bytes memory proxyCreationCode = abi.encodePacked(
            type(ERC1967Proxy).creationCode,
            abi.encode(
                walletImplementation,
                abi.encodeWithSignature("initialize(bytes32,bytes32)", publicKeyX, publicKeyY)
            )
        );
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(proxyCreationCode))
        );
        return address(uint160(uint256(hash)));
    }
}
