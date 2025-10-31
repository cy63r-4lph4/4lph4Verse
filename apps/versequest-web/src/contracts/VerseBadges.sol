// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IVerseBadges
 * @dev Interface for VerseBadges NFT contract integration
 */
interface IVerseBadges {
  function mintBadge(
    address recipient,
    string memory name,
    string memory description,
    string memory category,
    string memory tokenURI
  ) external returns (uint256);
}
