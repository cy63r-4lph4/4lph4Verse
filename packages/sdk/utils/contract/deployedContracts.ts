/**
 * 4lph4Verse Deployed Contracts — Auto-generated
 * Do not edit by hand.
 */

import type { Abi } from "viem";
import CoreFaucet_11142220Abi from "./abis/11142220/CoreFaucet.json";
import CoreToken_11142220Abi from "./abis/11142220/CoreToken.json";
import HireCoreJobBoardImpl_11142220Abi from "./abis/11142220/HireCoreJobBoardImpl.json";
import HireCoreJobManagerImpl_11142220Abi from "./abis/11142220/HireCoreJobManagerImpl.json";
import HireCoreScoreModelImpl_11142220Abi from "./abis/11142220/HireCoreScoreModelImpl.json";
import AppRegistryImpl_11142220Abi from "./abis/11142220/AppRegistryImpl.json";
import BadgeRegistryImpl_11142220Abi from "./abis/11142220/BadgeRegistryImpl.json";
import ReputationHubImpl_11142220Abi from "./abis/11142220/ReputationHubImpl.json";
import ScoreAggregatorImpl_11142220Abi from "./abis/11142220/ScoreAggregatorImpl.json";
import VerseProfileImpl_11142220Abi from "./abis/11142220/VerseProfileImpl.json";
import HireCoreJobBoardProxy_11142220Abi from "./abis/11142220/HireCoreJobBoardProxy.json";
import HireCoreJobManagerProxy_11142220Abi from "./abis/11142220/HireCoreJobManagerProxy.json";
import HireCoreScoreModelProxy_11142220Abi from "./abis/11142220/HireCoreScoreModelProxy.json";
import AppRegistryProxy_11142220Abi from "./abis/11142220/AppRegistryProxy.json";
import BadgeRegistryProxy_11142220Abi from "./abis/11142220/BadgeRegistryProxy.json";
import ReputationHubProxy_11142220Abi from "./abis/11142220/ReputationHubProxy.json";
import ScoreAggregatorProxy_11142220Abi from "./abis/11142220/ScoreAggregatorProxy.json";
import VerseProfileProxy_11142220Abi from "./abis/11142220/VerseProfileProxy.json";
import HireCoreJobBoard_11142220Abi from "./abis/11142220/HireCoreJobBoard.json";
import HireCoreJobManager_11142220Abi from "./abis/11142220/HireCoreJobManager.json";
import HireCoreScoreModel_11142220Abi from "./abis/11142220/HireCoreScoreModel.json";
import AppRegistry_11142220Abi from "./abis/11142220/AppRegistry.json";
import BadgeRegistry_11142220Abi from "./abis/11142220/BadgeRegistry.json";
import ReputationHub_11142220Abi from "./abis/11142220/ReputationHub.json";
import ScoreAggregator_11142220Abi from "./abis/11142220/ScoreAggregator.json";
import VerseProfile_11142220Abi from "./abis/11142220/VerseProfile.json";

// Utility: preserve ABI type from JSON imports
type ExtractAbi<T> = T extends Abi ? T : Abi;

export type DeployedContract<TAbi extends Abi = Abi> = {
  address: `0x${string}`;
  abi: TAbi;
  deployedOnBlock: number;
};

export const chainNames = {
  "31337": "localhost",
  "42220": "celo",
  "11142220": "celoSepolia",
} as const;

export const deployedContracts = {
  11142220: {
    CoreFaucet: {
      address: "0xb5d8887AB09AdB5983AACEed4e1AbB9267407823",
      abi: CoreFaucet_11142220Abi as ExtractAbi<typeof CoreFaucet_11142220Abi>,
      deployedOnBlock: 0,
    },
    CoreToken: {
      address: "0xB0CB172Ea557F4bd53A11BB259050fFA9e8B2b94",
      abi: CoreToken_11142220Abi as ExtractAbi<typeof CoreToken_11142220Abi>,
      deployedOnBlock: 0,
    },
    HireCoreJobBoardImpl: {
      address: "0x47Ee34e86Bf00CaC60f0E4A74cf135a07bF9D8a8",
      abi: HireCoreJobBoardImpl_11142220Abi as ExtractAbi<
        typeof HireCoreJobBoardImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobManagerImpl: {
      address: "0xA4a56053Ec9a7f6B2c66D9Ef3098BED80BdA585C",
      abi: HireCoreJobManagerImpl_11142220Abi as ExtractAbi<
        typeof HireCoreJobManagerImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreScoreModelImpl: {
      address: "0x7c52855bd68e8d3428aad3B44604C6c3Dab70a4a",
      abi: HireCoreScoreModelImpl_11142220Abi as ExtractAbi<
        typeof HireCoreScoreModelImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    AppRegistryImpl: {
      address: "0xfd311636AF65F9f6cCa13a0a508d1988F50A2733",
      abi: AppRegistryImpl_11142220Abi as ExtractAbi<
        typeof AppRegistryImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    BadgeRegistryImpl: {
      address: "0x1b398652b2dA52E737f6b9276e8617EE6ac0ca70",
      abi: BadgeRegistryImpl_11142220Abi as ExtractAbi<
        typeof BadgeRegistryImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ReputationHubImpl: {
      address: "0x8b333d3AbF1E60aDc395a9aC96F94FFCeAc7997d",
      abi: ReputationHubImpl_11142220Abi as ExtractAbi<
        typeof ReputationHubImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ScoreAggregatorImpl: {
      address: "0x4C522BD407A2d50eBF2aF12233F0653ffa0609a9",
      abi: ScoreAggregatorImpl_11142220Abi as ExtractAbi<
        typeof ScoreAggregatorImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfileImpl: {
      address: "0xfEbC66328BE2302B08Eb8676a957bAc4eE768Da2",
      abi: VerseProfileImpl_11142220Abi as ExtractAbi<
        typeof VerseProfileImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobBoardProxy: {
      address: "0x56a5BA686856F0787ce1B0278ED55D359A1D050e",
      abi: HireCoreJobBoardProxy_11142220Abi as ExtractAbi<
        typeof HireCoreJobBoardProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobManagerProxy: {
      address: "0x775808914a3f338eebaEd255fD4Ba6403546b57a",
      abi: HireCoreJobManagerProxy_11142220Abi as ExtractAbi<
        typeof HireCoreJobManagerProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreScoreModelProxy: {
      address: "0xb4741A7d2d26a59fbeF9fb17BEbb65e1acb6c5DA",
      abi: HireCoreScoreModelProxy_11142220Abi as ExtractAbi<
        typeof HireCoreScoreModelProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    AppRegistryProxy: {
      address: "0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735",
      abi: AppRegistryProxy_11142220Abi as ExtractAbi<
        typeof AppRegistryProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    BadgeRegistryProxy: {
      address: "0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE",
      abi: BadgeRegistryProxy_11142220Abi as ExtractAbi<
        typeof BadgeRegistryProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ReputationHubProxy: {
      address: "0xB617E64D4b1C927d7cE3e35f7bbA852bC2c5c50F",
      abi: ReputationHubProxy_11142220Abi as ExtractAbi<
        typeof ReputationHubProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ScoreAggregatorProxy: {
      address: "0xFC6F44E9307B2CACbA608CDc6A3D9A57876cfD66",
      abi: ScoreAggregatorProxy_11142220Abi as ExtractAbi<
        typeof ScoreAggregatorProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfileProxy: {
      address: "0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E",
      abi: VerseProfileProxy_11142220Abi as ExtractAbi<
        typeof VerseProfileProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobBoard: {
      address: "0x56a5BA686856F0787ce1B0278ED55D359A1D050e",
      abi: HireCoreJobBoard_11142220Abi as ExtractAbi<
        typeof HireCoreJobBoard_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobManager: {
      address: "0x775808914a3f338eebaEd255fD4Ba6403546b57a",
      abi: HireCoreJobManager_11142220Abi as ExtractAbi<
        typeof HireCoreJobManager_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreScoreModel: {
      address: "0xb4741A7d2d26a59fbeF9fb17BEbb65e1acb6c5DA",
      abi: HireCoreScoreModel_11142220Abi as ExtractAbi<
        typeof HireCoreScoreModel_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    AppRegistry: {
      address: "0xb8be06EB50fe5a4089Bc8CcA3C5240e613c29735",
      abi: AppRegistry_11142220Abi as ExtractAbi<
        typeof AppRegistry_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    BadgeRegistry: {
      address: "0x2D3D0525A0FdFE8032d6eA6D5e3d5223d60526aE",
      abi: BadgeRegistry_11142220Abi as ExtractAbi<
        typeof BadgeRegistry_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ReputationHub: {
      address: "0xB617E64D4b1C927d7cE3e35f7bbA852bC2c5c50F",
      abi: ReputationHub_11142220Abi as ExtractAbi<
        typeof ReputationHub_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ScoreAggregator: {
      address: "0xFC6F44E9307B2CACbA608CDc6A3D9A57876cfD66",
      abi: ScoreAggregator_11142220Abi as ExtractAbi<
        typeof ScoreAggregator_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfile: {
      address: "0x9B347f8b7118d673730d8BA774975AcBe1DD4d5E",
      abi: VerseProfile_11142220Abi as ExtractAbi<
        typeof VerseProfile_11142220Abi
      >,
      deployedOnBlock: 0,
    },
  },
} as const;

export type DeployedContracts = typeof deployedContracts;
export type ChainId = keyof DeployedContracts;

export type ContractNames<C extends ChainId> = keyof DeployedContracts[C];

export function getDeployedContract<
  C extends ChainId,
  N extends ContractNames<C>,
>(chainId: C, name: N): DeployedContracts[C][N] {
  return deployedContracts[chainId][name];
}
