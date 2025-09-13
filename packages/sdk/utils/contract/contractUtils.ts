import { DeployedContracts, DeployedContract } from "./deployedContracts";
import { ethers } from "ethers";

export async function readContractByName(
  name: string,
  method: string,
  args: any[] = [],
  options: { provider?: ethers.Provider } = {}
) {
  const config: DeployedContract = DeployedContracts[name];
  if (!config) throw new Error(`Contract ${name} not found`);
  const contract = new ethers.Contract(config.address, config.abi, options.provider);
  if (!contract[method]) throw new Error(`Method ${method} not found`);
  return await contract[method](...args);
}

export async function writeContractByName(
  name: string,
  method: string,
  args: any[] = [],
  options: {
    signer?: ethers.Signer;
    useRelayer?: boolean;
    relayerEndpoint?: string;
  } = {}
) {
  const config: DeployedContract = DeployedContracts[name];
  if (!config) throw new Error(`Contract ${name} not found`);

  if (options.useRelayer) {
    if (!options.relayerEndpoint) throw new Error("Relayer endpoint not set");
    return await fetch(`${options.relayerEndpoint}/tx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract: config.address, method, args }),
    }).then((res) => res.json());
  }

  if (!options.signer) throw new Error("Signer is required when not using relayer");
  const contract = new ethers.Contract(config.address, config.abi, options.signer);
  if (!contract[method]) throw new Error(`Method ${method} not found`);
  return await contract[method](...args);
}

export const ContractUtils = {
  get: (nameOrConfig: string | DeployedContract, options?: any) => {
    if (typeof nameOrConfig === "string") {
      const config = DeployedContracts[nameOrConfig];
      if (!config) throw new Error(`Contract ${nameOrConfig} not found`);
      return new ethers.Contract(
        config.address,
        config.abi,
        options?.signer || options?.provider
      );
    }
    return new ethers.Contract(
      nameOrConfig.address,
      nameOrConfig.abi,
      options?.signer || options?.provider
    );
  },
  read: readContractByName,
  write: writeContractByName,
};
