/**
 * Basic Ethereum address validation.
 *
 * @param address - Address string
 * @returns boolean
 */
export function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
