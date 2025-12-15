/* -------------------------------------------------------------------------- */
/* VerseProfile v2 — Unified Identity Schema (HireCore-Ready)                 */
/* -------------------------------------------------------------------------- */

export interface VerseProfile {
  /** Verse-wide universal identity */
  verseId: number;
  handle: string; // @cy63r_4lph4
  displayName: string; // Cy63r_4lph4~🐉
  avatar?: string | File; // IPFS / CDN link
  banner?: string; // Profile banner image
  bio?: string; // Universal bio / creed
  purpose?: string;
  verified?: boolean;
  owner: string; // Primary wallet
  delegate:string;
  reputation?: number; // Verse-wide trust score (0–100)
  location?: string; // Optional location string
  joinedAt?: string; // ISO date
  interests: string[];
  links: {
    x: string;
    github: string;
    telegram: string;
    website: string;
    farcaster: string;
  };

  /** Dynamic, app-specific persona modules */
  personas: {
    hirecore?: HireCorePersona;
    vaultoflove?: VaultOfLovePersona;
    leasevault?: LeaseVaultPersona;
    echain?: EChainPersona;
    [key: string]: any; // for future realms
  };

  // UI-only fields (not sent on-chain)
  avatarPreview?: string; // blob preview for chosen File
  previousAvatarURL?: string;
}

/* -------------------------------------------------------------------------- */
/* HireCore Persona                                                           */
/* -------------------------------------------------------------------------- */

export interface HireCorePersona {
  nickname?: string; // @architect_of_tomorrow
  type: "individual" | "organization";
  organizationName?: string | null;
  visibility?: "public" | "private" | "restricted";

  verseReputation?: {
    score: number; // 0–100
    level: string; // "Novice" | "Adept" | "Master"
    badges?: string[];
  };

  /** Functional profiles inside HireCore */
  roles: {
    worker?: WorkerProfile;
    hirer?: HirerProfile;
  };
}

/* -------------------------------------------------------------------------- */
/* Worker Profile (within HireCore)                                           */
/* -------------------------------------------------------------------------- */

export interface WorkerProfile {
  title?: string;
  bio?: string;
  hub?: string; // e.g. "Accra Digital Hub"
  skills?: string[];
  services?: string[];
  applications?: any[]; // Job applications made
  availability?: "available" | "busy" | "away";
  hourlyRate?: number;
  completedTasks?: number;
  rating?: number;
  earnings?: number;
  portfolio?: PortfolioItem[];
  preferences?: WorkerPreferences;
}

/* -------------------------------------------------------------------------- */
/* Hirer Profile (within HireCore)                                            */
/* -------------------------------------------------------------------------- */

export interface HirerProfile {
  title?: string;
  bio?: string;
  hub?: string; // e.g. "Accra HQ"
  postedTasks?: number;
  activeHires?: number;
  totalSpent?: number;
  rating?: number;
  companyName?: string;
  clientTier?: "Bronze" | "Silver" | "Gold" | "Platinum";
  paymentVerified?: boolean;
  hireHistory?: HireHistoryItem[];
  teams?: string[];
  recentTasks?: any[]; // Recent tasks posted
  portfolio?: PortfolioItem[];
  preferences?: HirerPreferences;
}

/* -------------------------------------------------------------------------- */
/* Reusable Sub-Types                                                         */
/* -------------------------------------------------------------------------- */

export interface PortfolioItem {
  title: string;
  link?: string;
  description?: string;
}

export interface WorkerPreferences {
  taskTypes?: string[];
  budgetRange?: { min: number; max: number };
  preferredChains?: string[];
  communication?: string[];
}

export interface HirerPreferences {
  preferredSkills?: string[];
  budgetStrategy?: "low" | "medium" | "high";
  projectDuration?: "short-term" | "long-term";
}

export interface HireHistoryItem {
  workerHandle: string;
  taskId: string;
  review?: string;
}

/* -------------------------------------------------------------------------- */
/* Placeholder Interfaces for Future DApps                                   */
/* -------------------------------------------------------------------------- */

export interface VaultOfLovePersona {
  nickname?: string;
  title?: string;
  bio?: string;
  visibility?: "public" | "private";
}

export interface LeaseVaultPersona {
  nickname?: string;
  title?: string;
  bio?: string;
  propertiesOwned?: number;
  propertiesRented?: number;
}

export interface EChainPersona {
  nickname?: string;
  title?: string;
  bio?: string;
  verifiedTickets?: number;
}
