import deployedContracts from "./deployedContracts.json";

export type DeployedContract = {
  address: string;
  abi: any;
};

export const DeployedContracts: Record<string, DeployedContract> = deployedContracts;
