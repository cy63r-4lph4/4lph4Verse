// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title VerseReflectionHall
 * @dev Community Reflection Hub for post-quest discussions and peer reflections
 * Supports simple on-chain posts with IPFS content storage
 */
contract VerseReflectionHall is AccessControl, Pausable {
  
  bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

  struct Hall {
    uint256 id;
    string topic;
    string description;
    uint256 createdAt;
    address creator;
    bool active;
    uint256 postCount;
  }

  struct Post {
    uint256 id;
    uint256 hallId;
    address author;
    string contentURI;  // IPFS URI for post content
    uint256 timestamp;
    bool active;
  }

  mapping(uint256 => Hall) public halls;
  mapping(uint256 => Post) public posts;
  
  uint256 public hallCount;
  uint256 public postCount;

  // Custom errors
  error HallNotFound();
  error PostNotFound();
  error HallInactive();
  error PostInactive();
  error EmptyContent();

  // Events
  event HallCreated(
    uint256 indexed hallId,
    string topic,
    address indexed creator,
    uint256 timestamp
  );
  
  event PostCreated(
    uint256 indexed postId,
    uint256 indexed hallId,
    address indexed author,
    string contentURI,
    uint256 timestamp
  );
  
  event HallDeactivated(uint256 indexed hallId);
  event PostDeactivated(uint256 indexed postId);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(MODERATOR_ROLE, msg.sender);
  }

  /**
   * @dev Create a new reflection hall for community discussions
   * @param topic Hall topic/theme
   * @param description Detailed description of the hall purpose
   */
  function createHall(string memory topic, string memory description) 
    external 
    whenNotPaused 
    returns (uint256) 
  {
    if (bytes(topic).length == 0) revert EmptyContent();

    uint256 hallId = hallCount++;
    
    halls[hallId] = Hall({
      id: hallId,
      topic: topic,
      description: description,
      createdAt: block.timestamp,
      creator: msg.sender,
      active: true,
      postCount: 0
    });

    emit HallCreated(hallId, topic, msg.sender, block.timestamp);
    return hallId;
  }

  /**
   * @dev Create a post in a reflection hall
   * @param hallId Target hall ID
   * @param contentURI IPFS URI containing the post content
   */
  function createPost(uint256 hallId, string memory contentURI) 
    external 
    whenNotPaused 
    returns (uint256) 
  {
    if (hallId >= hallCount) revert HallNotFound();
    if (bytes(contentURI).length == 0) revert EmptyContent();
    
    Hall storage hall = halls[hallId];
    if (!hall.active) revert HallInactive();

    uint256 postId = postCount++;
    
    posts[postId] = Post({
      id: postId,
      hallId: hallId,
      author: msg.sender,
      contentURI: contentURI,
      timestamp: block.timestamp,
      active: true
    });

    hall.postCount++;

    emit PostCreated(postId, hallId, msg.sender, contentURI, block.timestamp);
    return postId;
  }

  /**
   * @dev Get hall details
   */
  function getHall(uint256 hallId) external view returns (
    uint256 id,
    string memory topic,
    string memory description,
    uint256 createdAt,
    address creator,
    bool active,
    uint256 postCount_
  ) {
    if (hallId >= hallCount) revert HallNotFound();
    
    Hall storage hall = halls[hallId];
    return (
      hall.id,
      hall.topic,
      hall.description,
      hall.createdAt,
      hall.creator,
      hall.active,
      hall.postCount
    );
  }

  /**
   * @dev Get post details
   */
  function getPost(uint256 postId) external view returns (
    uint256 id,
    uint256 hallId,
    address author,
    string memory contentURI,
    uint256 timestamp,
    bool active
  ) {
    if (postId >= postCount) revert PostNotFound();
    
    Post storage post = posts[postId];
    return (
      post.id,
      post.hallId,
      post.author,
      post.contentURI,
      post.timestamp,
      post.active
    );
  }

  /**
   * @dev Get total number of halls
   */
  function getTotalHalls() external view returns (uint256) {
    return hallCount;
  }

  /**
   * @dev Get total number of posts
   */
  function getTotalPosts() external view returns (uint256) {
    return postCount;
  }

  /**
   * @dev Moderator: Deactivate a hall
   */
  function deactivateHall(uint256 hallId) external onlyRole(MODERATOR_ROLE) {
    if (hallId >= hallCount) revert HallNotFound();
    
    halls[hallId].active = false;
    emit HallDeactivated(hallId);
  }

  /**
   * @dev Moderator: Deactivate a post
   */
  function deactivatePost(uint256 postId) external onlyRole(MODERATOR_ROLE) {
    if (postId >= postCount) revert PostNotFound();
    
    posts[postId].active = false;
    emit PostDeactivated(postId);
  }

  // TODO: add tipPost() with CØRE transfer integration
  // TODO: integrate with VerseProfile for enhanced user context
  // TODO: add post reactions and engagement metrics

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
