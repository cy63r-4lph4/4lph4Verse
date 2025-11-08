const usedSignatures = new Set<string>();

export function isSignatureUsed(hash: string) {
  return usedSignatures.has(hash.toLowerCase());
}

export function markSignatureUsed(hash: string) {
  usedSignatures.add(hash.toLowerCase());
}
