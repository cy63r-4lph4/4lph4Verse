// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title VerseCouncil  
 * @dev Governance Light - The Circle of Reflection for the 4lph4Verse
 * Simple 1 wallet = 1 vote governance for community proposals
 * No CØRE token dependencies - pure community voting
 */
contract VerseCouncil is AccessControl, Pausable {
  
  bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");

  struct Proposal {
    uint256 id;
    string title;
    string description;
    address proposer;
    uint256 createdAt;
    uint256 deadline;
    uint256 forVotes;
    uint256 againstVotes;
    bool executed;
    bool active;
    mapping(address => bool) hasVoted;
    address[] voters;
  }

  mapping(uint256 => Proposal) public proposals;
  uint256 public proposalCount;
  
  uint256 public constant MIN_VOTING_PERIOD = 1 days;
  uint256 public constant MAX_VOTING_PERIOD = 30 days;
  uint256 public constant DEFAULT_VOTING_PERIOD = 7 days;

  // Custom errors
  error ProposalNotFound();
  error ProposalExpired();
  error ProposalNotExpired();
  error ProposalInactive();
  error ProposalAlreadyExecuted();
  error AlreadyVoted();
  error InvalidVotingPeriod();
  error EmptyTitle();

  // Events
  event ProposalCreated(
    uint256 indexed proposalId,
    string title,
    address indexed proposer,
    uint256 deadline
  );
  
  event VoteCast(
    uint256 indexed proposalId,
    address indexed voter,
    bool support,
    uint256 timestamp
  );
  
  event ProposalExecuted(
    uint256 indexed proposalId,
    bool passed,
    uint256 forVotes,
    uint256 againstVotes
  );

  event ProposalDeactivated(uint256 indexed proposalId);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(PROPOSER_ROLE, msg.sender);
    
    // Allow any community member to create proposals initially
    _setRoleAdmin(PROPOSER_ROLE, DEFAULT_ADMIN_ROLE);
  }

  /**
   * @dev Create a new community proposal
   * @param title Proposal title
   * @param description Detailed proposal description
   * @param duration Voting period duration in seconds (0 for default)
   */
  function createProposal(
    string memory title,
    string memory description,
    uint256 duration
  ) external whenNotPaused returns (uint256) {
    if (bytes(title).length == 0) revert EmptyTitle();
    
    if (duration == 0) {
      duration = DEFAULT_VOTING_PERIOD;
    } else if (duration < MIN_VOTING_PERIOD || duration > MAX_VOTING_PERIOD) {
      revert InvalidVotingPeriod();
    }

    uint256 proposalId = proposalCount++;
    uint256 deadline = block.timestamp + duration;
    
    Proposal storage newProposal = proposals[proposalId];
    newProposal.id = proposalId;
    newProposal.title = title;
    newProposal.description = description;
    newProposal.proposer = msg.sender;
    newProposal.createdAt = block.timestamp;
    newProposal.deadline = deadline;
    newProposal.forVotes = 0;
    newProposal.againstVotes = 0;
    newProposal.executed = false;
    newProposal.active = true;

    emit ProposalCreated(proposalId, title, msg.sender, deadline);
    return proposalId;
  }

  /**
   * @dev Cast a vote on a proposal (1 wallet = 1 vote)
   * @param proposalId Target proposal ID
   * @param support True for 'for', false for 'against'
   */
  function vote(uint256 proposalId, bool support) external whenNotPaused {
    if (proposalId >= proposalCount) revert ProposalNotFound();
    
    Proposal storage proposal = proposals[proposalId];
    
    if (!proposal.active) revert ProposalInactive();
    if (block.timestamp >= proposal.deadline) revert ProposalExpired();
    if (proposal.hasVoted[msg.sender]) revert AlreadyVoted();

    proposal.hasVoted[msg.sender] = true;
    proposal.voters.push(msg.sender);

    if (support) {
      proposal.forVotes++;
    } else {
      proposal.againstVotes++;
    }

    emit VoteCast(proposalId, msg.sender, support, block.timestamp);
  }

  /**
   * @dev Execute/finalize a proposal after voting period ends
   * @param proposalId Target proposal ID
   */
  function executeProposal(uint256 proposalId) external {
    if (proposalId >= proposalCount) revert ProposalNotFound();
    
    Proposal storage proposal = proposals[proposalId];
    
    if (!proposal.active) revert ProposalInactive();
    if (proposal.executed) revert ProposalAlreadyExecuted();
    if (block.timestamp < proposal.deadline) revert ProposalNotExpired();

    proposal.executed = true;
    proposal.active = false;
    
    bool passed = proposal.forVotes > proposal.againstVotes;
    
    emit ProposalExecuted(proposalId, passed, proposal.forVotes, proposal.againstVotes);
  }

  /**
   * @dev Get proposal details (without mapping data)
   */
  function getProposal(uint256 proposalId) external view returns (
    uint256 id,
    string memory title,
    string memory description,
    address proposer,
    uint256 createdAt,
    uint256 deadline,
    uint256 forVotes,
    uint256 againstVotes,
    bool executed,
    bool active
  ) {
    if (proposalId >= proposalCount) revert ProposalNotFound();
    
    Proposal storage proposal = proposals[proposalId];
    return (
      proposal.id,
      proposal.title,
      proposal.description,
      proposal.proposer,
      proposal.createdAt,
      proposal.deadline,
      proposal.forVotes,
      proposal.againstVotes,
      proposal.executed,
      proposal.active
    );
  }

  /**
   * @dev Get proposal voters list
   */
  function getProposalVoters(uint256 proposalId) external view returns (address[] memory) {
    if (proposalId >= proposalCount) revert ProposalNotFound();
    return proposals[proposalId].voters;
  }

  /**
   * @dev Check if user has voted on a proposal
   */
  function hasVoted(uint256 proposalId, address user) external view returns (bool) {
    if (proposalId >= proposalCount) revert ProposalNotFound();
    return proposals[proposalId].hasVoted[user];
  }

  /**
   * @dev Get total proposals count
   */
  function getTotalProposals() external view returns (uint256) {
    return proposalCount;
  }

  /**
   * @dev Grant proposer role to community member
   */
  function grantProposerRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
    grantRole(PROPOSER_ROLE, account);
  }

  /**
   * @dev Admin: Deactivate a proposal (emergency)
   */
  function deactivateProposal(uint256 proposalId) external onlyRole(DEFAULT_ADMIN_ROLE) {
    if (proposalId >= proposalCount) revert ProposalNotFound();
    
    proposals[proposalId].active = false;
    emit ProposalDeactivated(proposalId);
  }

  // TODO: add delegate voting power for future aura-weighted voting
  // TODO: integrate with VerseProfile for enhanced voting context
  // TODO: add proposal categories and filtering

  /**
   * @dev Emergency pause functionality
   */
  function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }
}
