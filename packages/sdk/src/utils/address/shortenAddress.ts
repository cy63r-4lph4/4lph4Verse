/**
 * Shorten an Ethereum (or any) address for display.
 *
 * Example:
 * "0x1234567890abcdef1234567890abcdef12345678" → "0x1234...5678"
 *
 * @param address - Full address string
 * @param chars - Number of chars to show at start and end (default: 4)
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
