/**
 * 4lph4Verse Deployed Contracts — Auto-generated
 * Do not edit by hand.
 */

import type { Abi } from "viem";
import CoreFaucetImpl_4202Abi from "./abis/4202/CoreFaucetImpl.json";
import CoreTokenImpl_4202Abi from "./abis/4202/CoreTokenImpl.json";
import CoreTokenProxy_4202Abi from "./abis/4202/CoreTokenProxy.json";
import CoreToken_4202Abi from "./abis/4202/CoreToken.json";
import CoreFaucetProxy_4202Abi from "./abis/4202/CoreFaucetProxy.json";
import CoreFaucet_4202Abi from "./abis/4202/CoreFaucet.json";
import HumanVerificationModule_42220Abi from "./abis/42220/HumanVerificationModule.json";
import SelfRecoveryModule_42220Abi from "./abis/42220/SelfRecoveryModule.json";
import VerseProfileImpl_42220Abi from "./abis/42220/VerseProfileImpl.json";
import VerseProfileProxy_42220Abi from "./abis/42220/VerseProfileProxy.json";
import VerseProfile_42220Abi from "./abis/42220/VerseProfile.json";
import CoreFaucetImpl_84532Abi from "./abis/84532/CoreFaucetImpl.json";
import CoreTokenImpl_84532Abi from "./abis/84532/CoreTokenImpl.json";
import CoreTokenProxy_84532Abi from "./abis/84532/CoreTokenProxy.json";
import CoreToken_84532Abi from "./abis/84532/CoreToken.json";
import CoreFaucetProxy_84532Abi from "./abis/84532/CoreFaucetProxy.json";
import CoreFaucet_84532Abi from "./abis/84532/CoreFaucet.json";
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
import CoreFaucetImpl_11142220Abi from "./abis/11142220/CoreFaucetImpl.json";
import CoreTokenImpl_11142220Abi from "./abis/11142220/CoreTokenImpl.json";
import CoreTokenProxy_11142220Abi from "./abis/11142220/CoreTokenProxy.json";
import CoreFaucetProxy_11142220Abi from "./abis/11142220/CoreFaucetProxy.json";
import GuardianRecoveryImpl_11142220Abi from "./abis/11142220/GuardianRecoveryImpl.json";
import GuardianRecoveryProxy_11142220Abi from "./abis/11142220/GuardianRecoveryProxy.json";
import GuardianRecovery_11142220Abi from "./abis/11142220/GuardianRecovery.json";
import HumanVerificationModule_11142220Abi from "./abis/11142220/HumanVerificationModule.json";
import SelfRecoveryModule_11142220Abi from "./abis/11142220/SelfRecoveryModule.json";

// Utility: preserve ABI type from JSON imports
type ExtractAbi<T> = T extends Abi ? T : Abi;

export type DeployedContract<TAbi extends Abi = Abi> = {
  address: `0x${string}`;
  abi: TAbi;
  deployedOnBlock: number;
};

export const chainNames = {
  "4202": "liskSepolia",
  "42220": "celo",
  "84532": "baseSepolia",
  "11142220": "celoSepolia",
} as const;

export const deployedContracts = {
  4202: {
    CoreFaucetImpl: {
      address: "0x7a58069532202c1bB06CD61A36b470AC89E90fF9",
      abi: CoreFaucetImpl_4202Abi as ExtractAbi<typeof CoreFaucetImpl_4202Abi>,
      deployedOnBlock: 0,
    },
    CoreTokenImpl: {
      address: "0x565A99925AEd5b53F363EBB5BfE268bBD8d414fe",
      abi: CoreTokenImpl_4202Abi as ExtractAbi<typeof CoreTokenImpl_4202Abi>,
      deployedOnBlock: 0,
    },
    CoreTokenProxy: {
      address: "0x0532c1B35a566A15C1eD3014bA32E463b7428B04",
      abi: CoreTokenProxy_4202Abi as ExtractAbi<typeof CoreTokenProxy_4202Abi>,
      deployedOnBlock: 0,
    },
    CoreToken: {
      address: "0x0532c1B35a566A15C1eD3014bA32E463b7428B04",
      abi: CoreToken_4202Abi as ExtractAbi<typeof CoreToken_4202Abi>,
      deployedOnBlock: 0,
    },
    CoreFaucetProxy: {
      address: "0xe869dA17cb35d6c2DAbdB7B7Bda8fD2169A7Ce6e",
      abi: CoreFaucetProxy_4202Abi as ExtractAbi<
        typeof CoreFaucetProxy_4202Abi
      >,
      deployedOnBlock: 0,
    },
    CoreFaucet: {
      address: "0xe869dA17cb35d6c2DAbdB7B7Bda8fD2169A7Ce6e",
      abi: CoreFaucet_4202Abi as ExtractAbi<typeof CoreFaucet_4202Abi>,
      deployedOnBlock: 0,
    },
  },
  42220: {
    HumanVerificationModule: {
      address: "0xE7575C6Ff2fE71783fD80280FE685CaCf38b0774",
      abi: HumanVerificationModule_42220Abi as ExtractAbi<
        typeof HumanVerificationModule_42220Abi
      >,
      deployedOnBlock: 0,
    },
    SelfRecoveryModule: {
      address: "0xEe9ab2B8a636bc8a79dCe15bd8bbe17389aF36A7",
      abi: SelfRecoveryModule_42220Abi as ExtractAbi<
        typeof SelfRecoveryModule_42220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfileImpl: {
      address: "0xeDAF571966AF2299962e7930Ba707c05fA32aEae",
      abi: VerseProfileImpl_42220Abi as ExtractAbi<
        typeof VerseProfileImpl_42220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfileProxy: {
      address: "0x6806dC623f7b250D14fb78F17b417f2e9a8F228e",
      abi: VerseProfileProxy_42220Abi as ExtractAbi<
        typeof VerseProfileProxy_42220Abi
      >,
      deployedOnBlock: 0,
    },
    VerseProfile: {
      address: "0x6806dC623f7b250D14fb78F17b417f2e9a8F228e",
      abi: VerseProfile_42220Abi as ExtractAbi<typeof VerseProfile_42220Abi>,
      deployedOnBlock: 0,
    },
  },
  84532: {
    CoreFaucetImpl: {
      address: "0x2D12e51Ec5846e3F25524c8695f583AB482Fe4E0",
      abi: CoreFaucetImpl_84532Abi as ExtractAbi<
        typeof CoreFaucetImpl_84532Abi
      >,
      deployedOnBlock: 0,
    },
    CoreTokenImpl: {
      address: "0x08d1324535c07c600bCfD31f60cD3E96fD23211f",
      abi: CoreTokenImpl_84532Abi as ExtractAbi<typeof CoreTokenImpl_84532Abi>,
      deployedOnBlock: 0,
    },
    CoreTokenProxy: {
      address: "0xC65ba4e00e4E26eb9B913d1aBCa39CE609375D77",
      abi: CoreTokenProxy_84532Abi as ExtractAbi<
        typeof CoreTokenProxy_84532Abi
      >,
      deployedOnBlock: 0,
    },
    CoreToken: {
      address: "0xC65ba4e00e4E26eb9B913d1aBCa39CE609375D77",
      abi: CoreToken_84532Abi as ExtractAbi<typeof CoreToken_84532Abi>,
      deployedOnBlock: 0,
    },
    CoreFaucetProxy: {
      address: "0xbAFE479Ea9c432D5bF6C097b72f84Fb3a1298477",
      abi: CoreFaucetProxy_84532Abi as ExtractAbi<
        typeof CoreFaucetProxy_84532Abi
      >,
      deployedOnBlock: 0,
    },
    CoreFaucet: {
      address: "0xbAFE479Ea9c432D5bF6C097b72f84Fb3a1298477",
      abi: CoreFaucet_84532Abi as ExtractAbi<typeof CoreFaucet_84532Abi>,
      deployedOnBlock: 0,
    },
  },
  11142220: {
    CoreFaucet: {
      address: "0x32c838B35C1D326c86f683e81cD65c07aAda16F8",
      abi: CoreFaucet_11142220Abi as ExtractAbi<typeof CoreFaucet_11142220Abi>,
      deployedOnBlock: 0,
    },
    CoreToken: {
      address: "0x6C1d6A3076241f2519670e42A09AFea8C2007162",
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
      address: "0xC662DF15f5D6A7CE4861A246Ed94feC46bd842c6",
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
      address: "0xfaA9EF785E450E13144A3BD44e172a8489e38af1",
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
      address: "0xfaA9EF785E450E13144A3BD44e172a8489e38af1",
      abi: VerseProfile_11142220Abi as ExtractAbi<
        typeof VerseProfile_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    CoreFaucetImpl: {
      address: "0xBF187469715579E727810FF39930E291054948ee",
      abi: CoreFaucetImpl_11142220Abi as ExtractAbi<
        typeof CoreFaucetImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    CoreTokenImpl: {
      address: "0xe9e212121bCb2b1Da31c9647A3769FF9D0f06121",
      abi: CoreTokenImpl_11142220Abi as ExtractAbi<
        typeof CoreTokenImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    CoreTokenProxy: {
      address: "0x6C1d6A3076241f2519670e42A09AFea8C2007162",
      abi: CoreTokenProxy_11142220Abi as ExtractAbi<
        typeof CoreTokenProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    CoreFaucetProxy: {
      address: "0x32c838B35C1D326c86f683e81cD65c07aAda16F8",
      abi: CoreFaucetProxy_11142220Abi as ExtractAbi<
        typeof CoreFaucetProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    GuardianRecoveryImpl: {
      address: "0xB50B6748faD3f4b006889A8BB60f90aC297E2FE7",
      abi: GuardianRecoveryImpl_11142220Abi as ExtractAbi<
        typeof GuardianRecoveryImpl_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    GuardianRecoveryProxy: {
      address: "0xF765A222DC3cd54714E7dD0154fFF558F6EB5E82",
      abi: GuardianRecoveryProxy_11142220Abi as ExtractAbi<
        typeof GuardianRecoveryProxy_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    GuardianRecovery: {
      address: "0xF765A222DC3cd54714E7dD0154fFF558F6EB5E82",
      abi: GuardianRecovery_11142220Abi as ExtractAbi<
        typeof GuardianRecovery_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    HumanVerificationModule: {
      address: "0xD2403F09416a5B14657bA1ed6Dbe5de76faFA913",
      abi: HumanVerificationModule_11142220Abi as ExtractAbi<
        typeof HumanVerificationModule_11142220Abi
      >,
      deployedOnBlock: 0,
    },
    SelfRecoveryModule: {
      address: "0x1f94A215121c72756E5ad12dCdb3EC89BA0Ee769",
      abi: SelfRecoveryModule_11142220Abi as ExtractAbi<
        typeof SelfRecoveryModule_11142220Abi
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
