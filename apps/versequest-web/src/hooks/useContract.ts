import { useState, useEffect } from 'react';
import { contractService, BadgeData, HallData, ProposalData } from '@/lib/contractTransactions';
import { useWallet } from '@/hooks/useWallet';

export const useContract = () => {
  const { account } = useWallet();
  const [userAura, setUserAura] = useState<number>(0);
  const [userBadges, setUserBadges] = useState<BadgeData[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMinter, setIsMinter] = useState<boolean>(false);
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [isProposer, setIsProposer] = useState<boolean>(false);
  const [halls, setHalls] = useState<HallData[]>([]);
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user aura
  const fetchUserAura = async (address: string) => {
    try {
      const aura = await contractService.getUserAura(address);
      setUserAura(aura);
    } catch (error) {
      console.error('Failed to fetch user aura:', error);
    }
  };

  // Fetch user badges
  const fetchUserBadges = async (address: string) => {
    try {
      const badges = await contractService.getUserBadges(address);
      setUserBadges(badges);
    } catch (error) {
      console.error('Failed to fetch user badges:', error);
    }
  };

  // Check if user has admin role
  const checkAdminRole = async (address: string) => {
    try {
      const hasAdmin = await contractService.hasAdminRole(address);
      setIsAdmin(hasAdmin);
    } catch (error) {
      console.error('Failed to check admin role:', error);
    }
  };

  // Check if user has minter role
  const checkMinterRole = async (address: string) => {
    try {
      const hasMinter = await contractService.hasMinterRole(address);
      setIsMinter(hasMinter);
    } catch (error) {
      console.error('Failed to check minter role:', error);
    }
  };

  // Check if user has moderator role
  const checkModeratorRole = async (address: string) => {
    try {
      const hasModerator = await contractService.hasModeratorRole(address);
      setIsModerator(hasModerator);
    } catch (error) {
      console.error('Failed to check moderator role:', error);
    }
  };

  // Check if user has proposer role
  const checkProposerRole = async (address: string) => {
    try {
      const hasProposer = await contractService.hasProposerRole(address);
      setIsProposer(hasProposer);
    } catch (error) {
      console.error('Failed to check proposer role:', error);
    }
  };

  // Fetch quest data
  const fetchQuest = async (questId: string) => {
    try {
      return await contractService.getQuest(questId);
    } catch (error) {
      console.error('Failed to fetch quest:', error);
      return null;
    }
  };

  // Fetch all quests
  const fetchAllQuests = async () => {
    try {
      setLoading(true);
      const questCount = await contractService.getQuestCount();
      const quests = [];
      
      for (let i = 0; i < questCount; i++) {
        const quest = await contractService.getQuest(i.toString());
        if (quest) {
          quests.push(quest);
        }
      }
      
      return quests;
    } catch (error) {
      console.error('Failed to fetch all quests:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch all halls
  const fetchAllHalls = async () => {
    try {
      setLoading(true);
      const allHalls = await contractService.getAllHalls();
      setHalls(allHalls);
      return allHalls;
    } catch (error) {
      console.error('Failed to fetch halls:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch all proposals
  const fetchAllProposals = async () => {
    try {
      setLoading(true);
      const allProposals = await contractService.getAllProposals();
      setProposals(allProposals);
      return allProposals;
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initialize data when account changes
  useEffect(() => {
    if (account) {
      fetchUserAura(account);
      fetchUserBadges(account);
      checkAdminRole(account);
      checkMinterRole(account);
      checkModeratorRole(account);
      checkProposerRole(account);
    } else {
      setUserAura(0);
      setUserBadges([]);
      setIsAdmin(false);
      setIsMinter(false);
      setIsModerator(false);
      setIsProposer(false);
      setHalls([]);
      setProposals([]);
    }
  }, [account]);

  return {
    userAura,
    userBadges,
    isAdmin,
    isMinter,
    isModerator,
    isProposer,
    halls,
    proposals,
    loading,
    fetchUserAura,
    fetchUserBadges,
    fetchQuest,
    fetchAllQuests,
    fetchAllHalls,
    fetchAllProposals,
    contractService
  };
};
