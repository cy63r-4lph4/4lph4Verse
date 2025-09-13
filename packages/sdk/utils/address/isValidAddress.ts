/**
 * Basic Ethereum address validation.
 *
 * @param address - Address string
 * @returns boolean
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
