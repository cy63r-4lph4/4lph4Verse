import { getDeployedContract } from "../utils/contract/deployedContracts";

export const PROFILE_CHAIN = process.env.NEXT_PUBLIC_TESTx ? 11142220 : 42220;
export const HIRECORE_CHAIN = 11142220;
export const APPNAME = "Verse Profile";
export const SCOPE = "proof-of-alpha";
export const RECOVERY_SCOPE = "proof-of-owner";
export const VERIFICATION_ENDPOINt = getDeployedContract(
  PROFILE_CHAIN,
  "HumanVerificationModule"
).address.toLowerCase();
export const RECOVERY_ENDPOINT = getDeployedContract(
  PROFILE_CHAIN,
  "SelfRecoveryModule"
).address.toLowerCase();

