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
      address: "0x474098f2EBab5c422a4ACe883DD41948673c34c2",
      abi: HireCoreJobBoardImpl_11142220Abi as ExtractAbi<
        typeof HireCoreJobBoardImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobManagerImpl: {
      address: "0xeC5c58b733152Bc49d6BE1a0958Dd3d710eDD3F2",
      abi: HireCoreJobManagerImpl_11142220Abi as ExtractAbi<
        typeof HireCoreJobManagerImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreScoreModelImpl: {
      address: "0xB2e2E3BF4B58Db8e179e6DFD8037E05eDC8De3Db",
      abi: HireCoreScoreModelImpl_11142220Abi as ExtractAbi<
        typeof HireCoreScoreModelImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    AppRegistryImpl: {
      address: "0x2e929C052ab0fFb45de92Ce3f3329BcE95698c38",
      abi: AppRegistryImpl_11142220Abi as ExtractAbi<
        typeof AppRegistryImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    BadgeRegistryImpl: {
      address: "0x4E8BE118D8dc98D82BcdaCbECDf736c70EAb10B1",
      abi: BadgeRegistryImpl_11142220Abi as ExtractAbi<
        typeof BadgeRegistryImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ReputationHubImpl: {
      address: "0x51BE3370fBd5E117033a158a8218775f162854D7",
      abi: ReputationHubImpl_11142220Abi as ExtractAbi<
        typeof ReputationHubImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ScoreAggregatorImpl: {
      address: "0xcFb2B238762a9158aD985606F8CA5CE34e3ad317",
      abi: ScoreAggregatorImpl_11142220Abi as ExtractAbi<
        typeof ScoreAggregatorImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfileImpl: {
      address: "0x52EE8E43148a8b18Ee952b5c51ba0FA99FD30d60",
      abi: VerseProfileImpl_11142220Abi as ExtractAbi<
        typeof VerseProfileImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobBoardProxy: {
      address: "0xe2f6AAC0BfB6C4221d0e9180661C9D3A1B498F87",
      abi: HireCoreJobBoardProxy_11142220Abi as ExtractAbi<
        typeof HireCoreJobBoardProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobManagerProxy: {
      address: "0x2f8f52e88d4f4f0D22fEEb072fE238eE14ca2EEF",
      abi: HireCoreJobManagerProxy_11142220Abi as ExtractAbi<
        typeof HireCoreJobManagerProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreScoreModelProxy: {
      address: "0x0B9f200CB81E224Ca6b1D4A774922d2DE809910d",
      abi: HireCoreScoreModelProxy_11142220Abi as ExtractAbi<
        typeof HireCoreScoreModelProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    AppRegistryProxy: {
      address: "0xc1B7bBa4be08FecFfbf2fAc9063B3e7072A77320",
      abi: AppRegistryProxy_11142220Abi as ExtractAbi<
        typeof AppRegistryProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    BadgeRegistryProxy: {
      address: "0x1e0f9BF4876321737E8d72C836218DE3564F848E",
      abi: BadgeRegistryProxy_11142220Abi as ExtractAbi<
        typeof BadgeRegistryProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ReputationHubProxy: {
      address: "0x6B95CDD3439C643336611227701533ab5d12357f",
      abi: ReputationHubProxy_11142220Abi as ExtractAbi<
        typeof ReputationHubProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ScoreAggregatorProxy: {
      address: "0x2108B68F23bA2bDE60148E87F8FE136F21b4fAd3",
      abi: ScoreAggregatorProxy_11142220Abi as ExtractAbi<
        typeof ScoreAggregatorProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfileProxy: {
      address: "0x5e041CAF759403c4Ae1a3f8179270571FC31719E",
      abi: VerseProfileProxy_11142220Abi as ExtractAbi<
        typeof VerseProfileProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobBoard: {
      address: "0xe2f6AAC0BfB6C4221d0e9180661C9D3A1B498F87",
      abi: HireCoreJobBoard_11142220Abi as ExtractAbi<
        typeof HireCoreJobBoard_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreJobManager: {
      address: "0x2f8f52e88d4f4f0D22fEEb072fE238eE14ca2EEF",
      abi: HireCoreJobManager_11142220Abi as ExtractAbi<
        typeof HireCoreJobManager_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HireCoreScoreModel: {
      address: "0x0B9f200CB81E224Ca6b1D4A774922d2DE809910d",
      abi: HireCoreScoreModel_11142220Abi as ExtractAbi<
        typeof HireCoreScoreModel_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    AppRegistry: {
      address: "0xc1B7bBa4be08FecFfbf2fAc9063B3e7072A77320",
      abi: AppRegistry_11142220Abi as ExtractAbi<
        typeof AppRegistry_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    BadgeRegistry: {
      address: "0x1e0f9BF4876321737E8d72C836218DE3564F848E",
      abi: BadgeRegistry_11142220Abi as ExtractAbi<
        typeof BadgeRegistry_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ReputationHub: {
      address: "0x6B95CDD3439C643336611227701533ab5d12357f",
      abi: ReputationHub_11142220Abi as ExtractAbi<
        typeof ReputationHub_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    ScoreAggregator: {
      address: "0x2108B68F23bA2bDE60148E87F8FE136F21b4fAd3",
      abi: ScoreAggregator_11142220Abi as ExtractAbi<
        typeof ScoreAggregator_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfile: {
      address: "0x5e041CAF759403c4Ae1a3f8179270571FC31719E",
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
