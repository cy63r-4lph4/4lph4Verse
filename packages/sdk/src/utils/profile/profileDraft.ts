// utils/profileDraft.ts
const KEY = (wallet?: string, handle?: string) =>
  `verse_profile_draft::${wallet || "no_wallet"}::${handle || "no_handle"}`;

export function loadDraft(wallet?: string, handle?: string) {
  try {
    const raw = localStorage.getItem(KEY(wallet, handle));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(
  data: any,
  wallet?: string,
  handle?: string
) {
  try {
    localStorage.setItem(KEY(wallet, handle), JSON.stringify(data));
  } catch {}
}

export function clearDraft(wallet?: string, handle?: string) {
  try {
    localStorage.removeItem(KEY(wallet, handle));
  } catch {}
}

// Dedicated keys for CIDs so they can be reused across retries
const CIDKEY = (wallet?: string, handle?: string) =>
  `verse_profile_cids::${wallet || "no_wallet"}::${handle || "no_handle"}`;

export type ProfileCidCache = {
  avatarCID?: string | null;
  metadataCID?: string | null;
};

export function loadCids(wallet?: string, handle?: string): ProfileCidCache {
  try {
    const raw = localStorage.getItem(CIDKEY(wallet, handle));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCids(
  cids: ProfileCidCache,
  wallet?: string,
  handle?: string
) {
  try {
    localStorage.setItem(CIDKEY(wallet, handle), JSON.stringify(cids));
  } catch {}
}

export function clearCids(wallet?: string, handle?: string) {
  try {
    localStorage.removeItem(CIDKEY(wallet, handle));
  } catch {}
}
