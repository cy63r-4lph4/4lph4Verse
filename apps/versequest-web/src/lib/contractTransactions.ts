import { ethers } from 'ethers';
import { CELO_TESTNET_CONFIG } from '@/lib/config';
import { VerseQuestCoreAddress, VerseBadgesAddress, VerseReflectionHallAddress, VerseCouncilAddress } from '@/contracts/contractAddress';
import VerseQuestCoreABI from '@/abis/verseQuestCoreABI.json';
import VerseBadgesABI from '@/abis/verseBadgesABI.json';
import VerseReflectionHallABI from '@/abis/verseReflectionHallABI.json';
import VerseCouncilABI from '@/abis/verseCouncilABI.json';

// Network configuration
const NETWORK_CONFIG = {
  [CELO_TESTNET_CONFIG.chainId]: {
    chainId: `0x${CELO_TESTNET_CONFIG.chainId.toString(16)}`,
    chainName: CELO_TESTNET_CONFIG.name,
    nativeCurrency: {
      name: CELO_TESTNET_CONFIG.ticker,
      symbol: CELO_TESTNET_CONFIG.ticker,
      decimals: CELO_TESTNET_CONFIG.decimals,
    },
    rpcUrls: [CELO_TESTNET_CONFIG.rpcUrl],
    blockExplorerUrls: [CELO_TESTNET_CONFIG.explorerUrl],
  }
};

export interface CreateQuestParams {
  title: string;
  description: string;
  videoURI: string;
  reflectionQuestion: string;
  auraReward: number;
  maxWinners: number;
  duration: number; // in seconds
}

export interface QuestData {
  id: string;
  title: string;
  description: string;
  videoURI: string;
  reflectionQuestion: string;
  auraReward: number;
  maxWinners: number;
  endTime: number;
  ended: boolean;
  creator: string;
  participantCount: number;
}

export interface ReflectionData {
  contentURI: string;
  submittedAt: number;
  isWinner: boolean;
  auraAwarded: number;
}

export interface BadgeData {
  tokenId: string;
  name: string;
  description: string;
  category: string;
  mintedAt: number;
  recipient: string;
  tokenURI?: string;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}
export interface CreateHallResult extends TransactionResult {
  hallId?: string; 
}
export interface CreatePostResult extends TransactionResult {
  postId?: string; 
}
export interface CreateQuestResult extends TransactionResult {
  questId?: string; 
}
export interface CreateProposalResult extends TransactionResult {
  proposalId?: string; 
}
export interface MintBadgeResult extends TransactionResult {
  tokenId?: string; 
}
export interface HallData {
  id: string;
  topic: string;
  description: string;
  createdAt: number;
  creator: string;
  active: boolean;
  postCount: number;
}

export interface PostData {
  id: string;
  hallId: string;
  author: string;
  contentURI: string;
  timestamp: number;
  active: boolean;
}

export interface CreateHallParams {
  topic: string;
  description: string;
}

export interface CreatePostParams {
  hallId: string;
  content: string;
}

export interface ProposalData {
  id: string;
  title: string;
  description: string;
  proposer: string;
  createdAt: number;
  deadline: number;
  forVotes: number;
  againstVotes: number;
  executed: boolean;
  active: boolean;
}

export interface CreateProposalParams {
  title: string;
  description: string;
  duration?: number; // in seconds, 0 for default (7 days)
}
class ContractTransactionService {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private badgeContract: ethers.Contract;
  private hallContract: ethers.Contract;
  private councilContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(CELO_TESTNET_CONFIG.rpcUrl);
    this.contract = new ethers.Contract(VerseQuestCoreAddress, VerseQuestCoreABI, this.provider);
    this.badgeContract = new ethers.Contract(VerseBadgesAddress, VerseBadgesABI, this.provider);
    this.hallContract = new ethers.Contract(VerseReflectionHallAddress, VerseReflectionHallABI, this.provider);
     this.councilContract = new ethers.Contract(VerseCouncilAddress, VerseCouncilABI, this.provider);
 }

  // ===== QUEST METHODS =====

  // Network validation and switching
  private async validateNetwork(): Promise<boolean> {
    if (!window.ethereum) {
      throw new Error('No wallet found. Please install MetaMask or Valora.');
    }

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await web3Provider.getNetwork();
    
    if (network.chainId !== CELO_TESTNET_CONFIG.chainId) {
      await this.switchNetwork();
      return false;
    }
    return true;
  }

  private async switchNetwork(): Promise<void> {
    if (!window.ethereum) throw new Error('No wallet found');

    const config = NETWORK_CONFIG[CELO_TESTNET_CONFIG.chainId];
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [config],
        });
      } else {
        throw error;
      }
    }
  }

  private async getSignerAndContract(): Promise<{ signer: ethers.Signer; contract: ethers.Contract }> {
    if (!window.ethereum) {
      throw new Error('No wallet found. Please install MetaMask or Valora.');
    }

    await this.validateNetwork();
    
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(VerseQuestCoreAddress, VerseQuestCoreABI, signer);
    
    return { signer, contract };
  }

  // Create a new quest (Admin function)
  async createQuest(params: CreateQuestParams): Promise<CreateQuestResult> {
    try {
      const { contract } = await this.getSignerAndContract();

      // Estimate gas
      const gasEstimate = await contract.estimateGas.createQuest(
        params.title,
        params.description,
        params.videoURI,
        params.reflectionQuestion,
        params.auraReward,
        params.maxWinners,
        params.duration
      );

      const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer

      const tx = await contract.createQuest(
        params.title,
        params.description,
        params.videoURI,
        params.reflectionQuestion,
        params.auraReward,
        params.maxWinners,
        params.duration,
        { gasLimit }
      );

      const receipt = await tx.wait();
      
      // Extract quest ID from events
      const questCreatedEvent = receipt.events?.find(
        (event: any) => event.event === 'QuestCreated'
      );
      
      return { 
        success: true, 
        hash: receipt.transactionHash,
        questId: questCreatedEvent?.args?.questId?.toString()
      };
    } catch (error: any) {
      console.error('Create quest failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to create quest' 
      };
    }
  }

  // Submit a reflection for a quest
  async submitReflection(questId: string, reflectionContent: string): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();

      // For demo purposes, we'll store reflection content directly
      // In production, you'd upload to IPFS first
      const contentURI = `data:text/plain,${encodeURIComponent(reflectionContent)}`;

      // Check if already submitted
      const hasSubmitted = await contract.hasSubmittedReflection(questId, await contract.signer.getAddress());
      if (hasSubmitted) {
        throw new Error('You have already submitted a reflection for this quest');
      }

      // Estimate gas
      const gasEstimate = await contract.estimateGas.submitReflection(questId, contentURI);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await contract.submitReflection(questId, contentURI, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Submit reflection failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to submit reflection' 
      };
    }
  }

  // End a quest (Admin function)
  async endQuest(questId: string): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();

      const gasEstimate = await contract.estimateGas.endQuest(questId);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await contract.endQuest(questId, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('End quest failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to end quest' 
      };
    }
  }

  // Award aura to quest winners (Admin function)
  async awardAura(
    questId: string, 
    winners: string[], 
    auraAmounts: number[], 
    mintBadges: boolean = true
  ): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();

      const gasEstimate = await contract.estimateGas.awardAura(
        questId, 
        winners, 
        auraAmounts, 
        mintBadges
      );
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await contract.awardAura(questId, winners, auraAmounts, mintBadges, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Award aura failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to award aura' 
      };
    }
  }

  // Get quest details
  async getQuest(questId: string): Promise<QuestData | null> {
    try {
      const questData = await this.contract.getQuest(questId);
      
      return {
        id: questData.id.toString(),
        title: questData.title,
        description: questData.description,
        videoURI: questData.videoURI,
        reflectionQuestion: questData.reflectionQuestion,
        auraReward: questData.auraReward.toNumber(),
        maxWinners: questData.maxWinners.toNumber(),
        endTime: questData.endTime.toNumber() * 1000, // Convert to milliseconds
        ended: questData.ended,
        creator: questData.creator,
        participantCount: questData.participantCount.toNumber()
      };
    } catch (error) {
      console.error('Get quest failed:', error);
      return null;
    }
  }

  // Get user's reflection for a quest
  async getReflection(questId: string, userAddress: string): Promise<ReflectionData | null> {
    try {
      const reflectionData = await this.contract.getReflection(questId, userAddress);
      
      if (!reflectionData.contentURI) {
        return null;
      }

      return {
        contentURI: reflectionData.contentURI,
        submittedAt: reflectionData.submittedAt.toNumber() * 1000,
        isWinner: reflectionData.isWinner,
        auraAwarded: reflectionData.auraAwarded.toNumber()
      };
    } catch (error) {
      console.error('Get reflection failed:', error);
      return null;
    }
  }

  // Get quest participants
  async getQuestParticipants(questId: string): Promise<string[]> {
    try {
      return await this.contract.getQuestParticipants(questId);
    } catch (error) {
      console.error('Get quest participants failed:', error);
      return [];
    }
  }

  // Get user's total aura
  async getUserAura(userAddress: string): Promise<number> {
    try {
      const aura = await this.contract.getUserAura(userAddress);
      return aura.toNumber();
    } catch (error) {
      console.error('Get user aura failed:', error);
      return 0;
    }
  }

  // Check if user has submitted reflection
  async hasSubmittedReflection(questId: string, userAddress: string): Promise<boolean> {
    try {
      return await this.contract.hasSubmittedReflection(questId, userAddress);
    } catch (error) {
      console.error('Check submission failed:', error);
      return false;
    }
  }

  // Get quest count
  async getQuestCount(): Promise<number> {
    try {
      const count = await this.contract.questCount();
      return count.toNumber();
    } catch (error) {
      console.error('Get quest count failed:', error);
      return 0;
    }
  }

  // Check if user has admin role
  async hasAdminRole(userAddress: string): Promise<boolean> {
    try {
      const adminRole = await this.contract.ADMIN_ROLE();
      return await this.contract.hasRole(adminRole, userAddress);
    } catch (error) {
      console.error('Check admin role failed:', error);
      return false;
    }
  }

  // ===== BADGE METHODS =====

  // ===== REFLECTION HALL METHODS =====

  // Create a new reflection hall
  async createHall(params: CreateHallParams): Promise<CreateHallResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const hallContract = new ethers.Contract(VerseReflectionHallAddress, VerseReflectionHallABI, contract.signer);

      // Estimate gas
      const gasEstimate = await hallContract.estimateGas.createHall(
        params.topic,
        params.description
      );
      const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer

      const tx = await hallContract.createHall(
        params.topic,
        params.description,
        { gasLimit }
      );

      const receipt = await tx.wait();
      
      // Extract hall ID from events
      const hallCreatedEvent = receipt.events?.find(
        (event: any) => event.event === 'HallCreated'
      );
      
      return { 
        success: true, 
        hash: receipt.transactionHash,
        hallId: hallCreatedEvent?.args?.hallId?.toString()
      };
    } catch (error: any) {
      console.error('Create hall failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to create hall' 
      };
    }
  }

  // Create a post in a reflection hall
  async createPost(params: CreatePostParams): Promise<CreatePostResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const hallContract = new ethers.Contract(VerseReflectionHallAddress, VerseReflectionHallABI, contract.signer);

      // For demo purposes, we'll store post content directly
      // In production, you'd upload to IPFS first
      const contentURI = `data:text/plain,${encodeURIComponent(params.content)}`;

      // Estimate gas
      const gasEstimate = await hallContract.estimateGas.createPost(
        params.hallId,
        contentURI
      );
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await hallContract.createPost(params.hallId, contentURI, { gasLimit });
      const receipt = await tx.wait();

      // Extract post ID from events
      const postCreatedEvent = receipt.events?.find(
        (event: any) => event.event === 'PostCreated'
      );

      return { 
        success: true, 
        hash: receipt.transactionHash,
        postId: postCreatedEvent?.args?.postId?.toString()
      };
    } catch (error: any) {
      console.error('Create post failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to create post' 
      };
    }
  }

  // Get hall details
  async getHall(hallId: string): Promise<HallData | null> {
    try {
      const hallData = await this.hallContract.getHall(hallId);
      
      return {
        id: hallData.id.toString(),
        topic: hallData.topic,
        description: hallData.description,
        createdAt: hallData.createdAt.toNumber() * 1000, // Convert to milliseconds
        creator: hallData.creator,
        active: hallData.active,
        postCount: hallData.postCount_.toNumber()
      };
    } catch (error) {
      console.error('Get hall failed:', error);
      return null;
    }
  }

  // Get post details
  async getPost(postId: string): Promise<PostData | null> {
    try {
      const postData = await this.hallContract.getPost(postId);
      
      if (!postData.contentURI) {
        return null;
      }

      return {
        id: postData.id.toString(),
        hallId: postData.hallId.toString(),
        author: postData.author,
        contentURI: postData.contentURI,
        timestamp: postData.timestamp.toNumber() * 1000,
        active: postData.active
      };
    } catch (error) {
      console.error('Get post failed:', error);
      return null;
    }
  }

  // Get total number of halls
  async getTotalHalls(): Promise<number> {
    try {
      const total = await this.hallContract.getTotalHalls();
      return total.toNumber();
    } catch (error) {
      console.error('Get total halls failed:', error);
      return 0;
    }
  }

  // Get total number of posts
  async getTotalPosts(): Promise<number> {
    try {
      const total = await this.hallContract.getTotalPosts();
      return total.toNumber();
    } catch (error) {
      console.error('Get total posts failed:', error);
      return 0;
    }
  }

  // Get all halls (paginated approach for better performance)
  async getAllHalls(): Promise<HallData[]> {
    try {
      const totalHalls = await this.getTotalHalls();
      const halls: HallData[] = [];
      
      for (let i = 0; i < totalHalls; i++) {
        try {
          const hall = await this.getHall(i.toString());
          if (hall && hall.active) {
            halls.push(hall);
          }
        } catch (error) {
          console.error(`Failed to fetch hall ${i}:`, error);
        }
      }
      
      return halls.sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
    } catch (error) {
      console.error('Get all halls failed:', error);
      return [];
    }
  }

  // Get posts for a specific hall
  async getHallPosts(hallId: string, limit: number = 50): Promise<PostData[]> {
    try {
      const totalPosts = await this.getTotalPosts();
      const posts: PostData[] = [];
      let foundPosts = 0;
      
      // Iterate backwards to get newest posts first
      for (let i = totalPosts - 1; i >= 0 && foundPosts < limit; i--) {
        try {
          const post = await this.getPost(i.toString());
          if (post && post.hallId === hallId && post.active) {
            posts.push(post);
            foundPosts++;
          }
        } catch (error) {
          console.error(`Failed to fetch post ${i}:`, error);
        }
      }
      
      return posts;
    } catch (error) {
      console.error('Get hall posts failed:', error);
      return [];
    }
  }

  // Deactivate hall (Moderator function)
  async deactivateHall(hallId: string): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const hallContract = new ethers.Contract(VerseReflectionHallAddress, VerseReflectionHallABI, contract.signer);

      const gasEstimate = await hallContract.estimateGas.deactivateHall(hallId);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await hallContract.deactivateHall(hallId, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Deactivate hall failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to deactivate hall' 
      };
    }
  }

  // Check if user has moderator role
  async hasModeratorRole(userAddress: string): Promise<boolean> {
    try {
      const moderatorRole = await this.hallContract.MODERATOR_ROLE();
      return await this.hallContract.hasRole(moderatorRole, userAddress);
    } catch (error) {
      console.error('Check moderator role failed:', error);
      return false;
    }
  }

  // Mint a badge to a recipient (Admin/Minter function)
  async mintBadge(
    recipient: string,
    name: string,
    description: string,
    category: string,
    tokenURI: string = ""
  ): Promise<MintBadgeResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const badgeContract = new ethers.Contract(VerseBadgesAddress, VerseBadgesABI, contract.signer);

      const gasEstimate = await badgeContract.estimateGas.mintBadge(
        recipient,
        name,
        description,
        category,
        tokenURI
      );
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await badgeContract.mintBadge(
        recipient,
        name,
        description,
        category,
        tokenURI,
        { gasLimit }
      );

      const receipt = await tx.wait();
      
      // Extract badge token ID from events
      const badgeMintedEvent = receipt.events?.find(
        (event: any) => event.event === 'BadgeMinted'
      );
      
      return { 
        success: true, 
        hash: receipt.transactionHash,
        tokenId: badgeMintedEvent?.args?.tokenId?.toString()
      };
    } catch (error: any) {
      console.error('Mint badge failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to mint badge' 
      };
    }
  }

  // Batch mint badges to multiple recipients
  async batchMintBadge(
    recipients: string[],
    name: string,
    description: string,
    category: string,
    tokenURI: string = ""
  ): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const badgeContract = new ethers.Contract(VerseBadgesAddress, VerseBadgesABI, contract.signer);

      const gasEstimate = await badgeContract.estimateGas.batchMintBadge(
        recipients,
        name,
        description,
        category,
        tokenURI
      );
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await badgeContract.batchMintBadge(
        recipients,
        name,
        description,
        category,
        tokenURI,
        { gasLimit }
      );

      const receipt = await tx.wait();
      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Batch mint badges failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to mint badges' 
      };
    }
  }

  // Get user badges
  async getUserBadges(userAddress: string): Promise<BadgeData[]> {
    try {
      const tokenIds = await this.badgeContract.getUserBadges(userAddress);
      const badges: BadgeData[] = [];
      
      for (const tokenId of tokenIds) {
        try {
          const badgeData = await this.badgeContract.getBadge(tokenId);
          badges.push({
            tokenId: tokenId.toString(),
            name: badgeData.name,
            description: badgeData.description,
            category: badgeData.category,
            mintedAt: badgeData.mintedAt.toNumber() * 1000, // Convert to milliseconds
            recipient: badgeData.recipient
          });
        } catch (error) {
          console.error(`Failed to fetch badge ${tokenId}:`, error);
        }
      }
      
      return badges;
    } catch (error) {
      console.error('Get user badges failed:', error);
      return [];
    }
  }

  // Check if user has minter role
  async hasMinterRole(userAddress: string): Promise<boolean> {
    try {
      const minterRole = await this.badgeContract.MINTER_ROLE();
      return await this.badgeContract.hasRole(minterRole, userAddress);
    } catch (error) {
      console.error('Check minter role failed:', error);
      return false;
    }
  }

  // Get total number of badges
  async getTotalBadges(): Promise<number> {
    try {
      const total = await this.badgeContract.getTotalBadges();
      return total.toNumber();
    } catch (error) {
      console.error('Get total badges failed:', error);
      return 0;
    }
  }

  // Convenience method for quest completion badge
  async mintQuestCompletionBadge(
    recipient: string,
    questTitle: string,
    isWinner: boolean = false
  ): Promise<TransactionResult> {
    const badgeType = isWinner ? "Quest Winner" : "Quest Participant";
    const description = isWinner 
      ? `Won the "${questTitle}" quest with an exceptional reflection`
      : `Participated in the "${questTitle}" quest`;
    
    return this.mintBadge(
      recipient,
      badgeType,
      description,
      "Quest Master",
      ""
    );
  }

  // ===== COUNCIL METHODS =====

  // Create a new proposal
  async createProposal(params: CreateProposalParams): Promise<CreateProposalResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const councilContract = new ethers.Contract(VerseCouncilAddress, VerseCouncilABI, contract.signer);

      // Default duration is 0 (which uses contract's default of 7 days)
      const duration = params.duration || 0;

      // Estimate gas
      const gasEstimate = await councilContract.estimateGas.createProposal(
        params.title,
        params.description,
        duration
      );
      const gasLimit = gasEstimate.mul(120).div(100); // 20% buffer

      const tx = await councilContract.createProposal(
        params.title,
        params.description,
        duration,
        { gasLimit }
      );

      const receipt = await tx.wait();
      
      // Extract proposal ID from events
      const proposalCreatedEvent = receipt.events?.find(
        (event: any) => event.event === 'ProposalCreated'
      );
      
      return { 
        success: true, 
        hash: receipt.transactionHash,
        proposalId: proposalCreatedEvent?.args?.proposalId?.toString()
      };
    } catch (error: any) {
      console.error('Create proposal failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to create proposal' 
      };
    }
  }

  // Vote on a proposal
  async voteOnProposal(proposalId: string, support: boolean): Promise<CreateProposalResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const councilContract = new ethers.Contract(VerseCouncilAddress, VerseCouncilABI, contract.signer);

      // Check if user has already voted
      const hasVoted = await councilContract.hasVoted(proposalId, await contract.signer.getAddress());
      if (hasVoted) {
        throw new Error('You have already voted on this proposal');
      }

      // Estimate gas
      const gasEstimate = await councilContract.estimateGas.vote(proposalId, support);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await councilContract.vote(proposalId, support, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Vote failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to vote on proposal' 
      };
    }
  }

  // Execute a proposal (finalize after voting period ends)
  async executeProposal(proposalId: string): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const councilContract = new ethers.Contract(VerseCouncilAddress, VerseCouncilABI, contract.signer);

      const gasEstimate = await councilContract.estimateGas.executeProposal(proposalId);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await councilContract.executeProposal(proposalId, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Execute proposal failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to execute proposal' 
      };
    }
  }

  // Get proposal details
  async getProposal(proposalId: string): Promise<ProposalData | null> {
    try {
      const proposalData = await this.councilContract.getProposal(proposalId);
      
      return {
        id: proposalData.id.toString(),
        title: proposalData.title,
        description: proposalData.description,
        proposer: proposalData.proposer,
        createdAt: proposalData.createdAt.toNumber() * 1000, // Convert to milliseconds
        deadline: proposalData.deadline.toNumber() * 1000,
        forVotes: proposalData.forVotes.toNumber(),
        againstVotes: proposalData.againstVotes.toNumber(),
        executed: proposalData.executed,
        active: proposalData.active
      };
    } catch (error) {
      console.error('Get proposal failed:', error);
      return null;
    }
  }

  // Get proposal voters
  async getProposalVoters(proposalId: string): Promise<string[]> {
    try {
      return await this.councilContract.getProposalVoters(proposalId);
    } catch (error) {
      console.error('Get proposal voters failed:', error);
      return [];
    }
  }

  // Check if user has voted
  async hasUserVoted(proposalId: string, userAddress: string): Promise<boolean> {
    try {
      return await this.councilContract.hasVoted(proposalId, userAddress);
    } catch (error) {
      console.error('Check user voted failed:', error);
      return false;
    }
  }

  // Get total number of proposals
  async getTotalProposals(): Promise<number> {
    try {
      const total = await this.councilContract.getTotalProposals();
      return total.toNumber();
    } catch (error) {
      console.error('Get total proposals failed:', error);
      return 0;
    }
  }

  // Get all proposals (paginated approach)
  async getAllProposals(): Promise<ProposalData[]> {
    try {
      const totalProposals = await this.getTotalProposals();
      const proposals: ProposalData[] = [];
      
      for (let i = 0; i < totalProposals; i++) {
        try {
          const proposal = await this.getProposal(i.toString());
          if (proposal) {
            proposals.push(proposal);
          }
        } catch (error) {
          console.error(`Failed to fetch proposal ${i}:`, error);
        }
      }
      
      return proposals.sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
    } catch (error) {
      console.error('Get all proposals failed:', error);
      return [];
    }
  }

  // Deactivate proposal (Admin function)
  async deactivateProposal(proposalId: string): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const councilContract = new ethers.Contract(VerseCouncilAddress, VerseCouncilABI, contract.signer);

      const gasEstimate = await councilContract.estimateGas.deactivateProposal(proposalId);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await councilContract.deactivateProposal(proposalId, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Deactivate proposal failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to deactivate proposal' 
      };
    }
  }

  // Grant proposer role to user (Admin function)
  async grantProposerRole(userAddress: string): Promise<TransactionResult> {
    try {
      const { contract } = await this.getSignerAndContract();
      const councilContract = new ethers.Contract(VerseCouncilAddress, VerseCouncilABI, contract.signer);

      const gasEstimate = await councilContract.estimateGas.grantProposerRole(userAddress);
      const gasLimit = gasEstimate.mul(120).div(100);

      const tx = await councilContract.grantProposerRole(userAddress, { gasLimit });
      const receipt = await tx.wait();

      return { success: true, hash: receipt.transactionHash };
    } catch (error: any) {
      console.error('Grant proposer role failed:', error);
      return { 
        success: false, 
        error: error.reason || error.message || 'Failed to grant proposer role' 
      };
    }
  }

  // Check if user has proposer role
  async hasProposerRole(userAddress: string): Promise<boolean> {
    try {
      const proposerRole = await this.councilContract.PROPOSER_ROLE();
      return await this.councilContract.hasRole(proposerRole, userAddress);
    } catch (error) {
      console.error('Check proposer role failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const contractService = new ContractTransactionService();

// Utility functions
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  
  if (days > 0) return `${days} days`;
  if (hours > 0) return `${hours} hours`;
  return 'Less than 1 hour';
};

export const parseReflectionContent = (contentURI: string): string => {
  if (contentURI.startsWith('data:text/plain,')) {
    return decodeURIComponent(contentURI.replace('data:text/plain,', ''));
  }
  return contentURI;
};

export const parsePostContent = (contentURI: string): string => {
  if (contentURI.startsWith('data:text/plain,')) {
    return decodeURIComponent(contentURI.replace('data:text/plain,', ''));
  }
  return contentURI;
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default contractService;
