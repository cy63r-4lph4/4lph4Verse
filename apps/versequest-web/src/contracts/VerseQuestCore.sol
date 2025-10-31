// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../interfaces/IVerseBadges.sol";

/**
 * @title VerseQuestCore
 * @dev Quest & Reflection Manager for the 4lph4Verse learning platform
 * Manages reflective quests, submissions, aura rewards, and badge minting
 */
contract VerseQuestCore is AccessControl, ReentrancyGuard, Pausable {
  
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  
  struct Quest {
    uint256 id;
    string title;
    string description;
    string videoURI;
    string reflectionQuestion;
    uint256 auraReward;      // aura points per winner
    uint256 maxWinners;      // number of top reflections
    uint256 endTime;
    bool ended;
    address creator;
    address[] participants;
  }

  struct Reflection {
    string contentURI;       // IPFS URI for reflection content
    uint256 submittedAt;
    bool isWinner;
    uint256 auraAwarded;
  }

  mapping(uint256 => Quest) public quests;
  mapping(uint256 => mapping(address => Reflection)) public reflections;
  mapping(address => uint256) public userAura;
  
  uint256 public questCount;
  IVerseBadges public verseBadges;

  // Custom errors
  error QuestNotFound();
  error QuestAlreadyEnded();
  error QuestNotEnded();
  error QuestActive();
  error AlreadySubmitted();
  error InvalidWinners();
  error InvalidEndTime();
  error ArrayLengthMismatch();
  error QuestInactive();
  error QuestExpired();

  // Events
  event QuestCreated(
    uint256 indexed questId,
    string title,
    address indexed creator,
    uint256 auraReward,
    uint256 maxWinners,
    uint256 endTime
  );
  
  event ReflectionSubmitted(
    uint256 indexed questId,
    address indexed participant,
    string contentURI,
    uint256 timestamp
  );
  
  event QuestEnded(uint256 indexed questId, uint256 totalParticipants);
  
  event AuraAwarded(
    uint256 indexed questId,
    address indexed recipient,
    uint256 auraAmount,
    bool isWinner
  );

  event BadgeContractSet(address indexed verseBadges);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(ADMIN_ROLE, msg.sender);
  }

  /**
   * @dev Set VerseBadges contract for badge minting integration
   * @param _verseBadges Address of VerseBadges contract
   */
  function setVerseBadgesContract(address _verseBadges) external onlyRole(DEFAULT_ADMIN_ROLE) {
    verseBadges = IVerseBadges(_verseBadges);
    emit BadgeContractSet(_verseBadges);
  }

  /**
   * @dev Create a new reflective quest
   * @param title Quest title
   * @param description Quest description
   * @param videoURI Video content URI (IPFS)
   * @param reflectionQuestion Question for participants to reflect on
   * @param auraReward Aura points awarded per winner
   * @param maxWinners Maximum number of winners
   * @param duration Quest duration in seconds
   */
  function createQuest(
    string memory title,
    string memory description,
    string memory videoURI,
    string memory reflectionQuestion,
    uint256 auraReward,
    uint256 maxWinners,
    uint256 duration
  ) external onlyRole(ADMIN_ROLE) whenNotPaused returns (uint256) {
    if (duration == 0) revert InvalidEndTime();
    if (maxWinners == 0) revert InvalidWinners();

    uint256 questId = questCount++;
    uint256 endTime = block.timestamp + duration;

    quests[questId] = Quest({
      id: questId,
      title: title,
      description: description,
      videoURI: videoURI,
      reflectionQuestion: reflectionQuestion,
      auraReward: auraReward,
      maxWinners: maxWinners,
      endTime: endTime,
      ended: false,
      creator: msg.sender,
      participants: new address[](0)
    });

    emit QuestCreated(questId, title, msg.sender, auraReward, maxWinners, endTime);
    return questId;
  }

  /**
   * @dev Submit a reflection for a quest
   * @param questId Target quest ID
   * @param contentURI IPFS URI containing the reflection content
   */
  function submitReflection(uint256 questId, string memory contentURI) 
    external 
    whenNotPaused 
  {
    if (questId >= questCount) revert QuestNotFound();
    
    Quest storage quest = quests[questId];
    if (quest.ended) revert QuestInactive();
    if (block.timestamp >= quest.endTime) revert QuestExpired();
    if (bytes(reflections[questId][msg.sender].contentURI).length > 0) revert AlreadySubmitted();

    reflections[questId][msg.sender] = Reflection({
      contentURI: contentURI,
      submittedAt: block.timestamp,
      isWinner: false,
      auraAwarded: 0
    });

    quest.participants.push(msg.sender);

    emit ReflectionSubmitted(questId, msg.sender, contentURI, block.timestamp);
  }

  /**
   * @dev End a quest (admin only)
   * @param questId Quest ID to end
   */
  function endQuest(uint256 questId) external onlyRole(ADMIN_ROLE) {
    if (questId >= questCount) revert QuestNotFound();
    
    Quest storage quest = quests[questId];
    if (quest.ended) revert QuestAlreadyEnded();

    quest.ended = true;
    emit QuestEnded(questId, quest.participants.length);
  }

  /**
   * @dev Award aura to quest winners and optionally mint badges
   * @param questId Target quest ID
   * @param winners Array of winner addresses
   * @param auraAmounts Array of aura amounts for each winner
   * @param mintBadges Whether to mint Quest Master badges
   */
  function awardAura(
    uint256 questId,
    address[] memory winners,
    uint256[] memory auraAmounts,
    bool mintBadges
  ) external onlyRole(ADMIN_ROLE) nonReentrant {
    if (questId >= questCount) revert QuestNotFound();
    if (winners.length != auraAmounts.length) revert ArrayLengthMismatch();
    
    Quest storage quest = quests[questId];
    if (!quest.ended) revert QuestNotEnded();
    if (winners.length > quest.maxWinners) revert InvalidWinners();

    for (uint256 i = 0; i < winners.length; i++) {
      address winner = winners[i];
      uint256 auraAmount = auraAmounts[i];
      
      // Verify winner actually submitted
      if (bytes(reflections[questId][winner].contentURI).length == 0) continue;
      
      // Update reflection status and award aura
      reflections[questId][winner].isWinner = true;
      reflections[questId][winner].auraAwarded = auraAmount;
      userAura[winner] += auraAmount;

      emit AuraAwarded(questId, winner, auraAmount, true);

      // Mint badge if enabled and contract is set
      if (mintBadges && address(verseBadges) != address(0)) {
        try verseBadges.mintBadge(
          winner,
          "Quest Master",
          "Completed a VerseQuest reflection successfully",
          "Quest Master",
          "" // Badge URI can be generated off-chain
        ) {} catch {
          // Badge minting failed, but continue with aura awards
        }
      }
    }
  }

  /**
   * @dev Get quest details
   */
  function getQuest(uint256 questId) external view returns (
    uint256 id,
    string memory title,
    string memory description,
    string memory videoURI,
    string memory reflectionQuestion,
    uint256 auraReward,
    uint256 maxWinners,
    uint256 endTime,
    bool ended,
    address creator,
    uint256 participantCount
  ) {
    if (questId >= questCount) revert QuestNotFound();
    
    Quest storage quest = quests[questId];
    return (
      quest.id,
      quest.title,
      quest.description,
      quest.videoURI,
      quest.reflectionQuestion,
      quest.auraReward,
      quest.maxWinners,
      quest.endTime,
      quest.ended,
      quest.creator,
      quest.participants.length
    );
  }

  /**
   * @dev Get reflection details for a user and quest
   */
  function getReflection(uint256 questId, address user) external view returns (
    string memory contentURI,
    uint256 submittedAt,
    bool isWinner,
    uint256 auraAwarded
  ) {
    if (questId >= questCount) revert QuestNotFound();
    
    Reflection storage reflection = reflections[questId][user];
    return (
      reflection.contentURI,
      reflection.submittedAt,
      reflection.isWinner,
      reflection.auraAwarded
    );
  }

  /**
   * @dev Get quest participants
   */
  function getQuestParticipants(uint256 questId) external view returns (address[] memory) {
    if (questId >= questCount) revert QuestNotFound();
    return quests[questId].participants;
  }

  /**
   * @dev Get user's total aura
   */
  function getUserAura(address user) external view returns (uint256) {
    return userAura[user];
  }

  /**
   * @dev Check if user submitted reflection for quest
   */
  function hasSubmittedReflection(uint256 questId, address user) external view returns (bool) {
    if (questId >= questCount) return false;
    return bytes(reflections[questId][user].contentURI).length > 0;
  }

  // TODO: integrate with VerseProfile for aura sync
  // TODO: integrate with VerseWallet for gasless reflection submissions
  // TODO: future rewardInCore() placeholder for CØRE token integration

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
