export class LinkEOADto {
  /** The Verse Profile ID to link the EOA to. */
  verseProfileId: string;

  /** The external EOA address (checksummed or not — will be normalized). */
  address: string;

  /**
   * Optional wallet application type for UX display.
   * e.g., 'metamask' | 'rainbow' | 'ledger' | 'rabby' | 'external'
   */
  walletType?: string;
}
