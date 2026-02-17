export interface ArenaSchool {
  id: string;
  name: string;
  slug: string;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  sector: string;
}

export interface LoginData {
  identity: string;
  password: string;
}

/**
 * Represents a primary educational institution (Hub) within the Arena ecosystem.
 */
export interface SchoolData {
  id: string; // Unique UUID or Nanoid
  name: string; // Formal name (e.g., "Stanford University")
  slug: string; // Tactical short-code (e.g., "STAN")

  // Stats for the Dashboard HUD
  studentCount: number; // Total "Fighters" enrolled
  courseCount: number; // Total "Sectors" active

  // Metadata & System Info
  status: "Active" | "Maintenance" | "Decommissioned";
  domain?: string; // Optional: e.g., "stanford.edu" for auto-routing users
  createdAt: string; // ISO Date string
  updatedAt?: string; // Track system modifications

  // Tactical Styling (Optional - for custom branding per school)
  brandColor?: string; // Hex code for primary theme overrides
}

export interface BattleSector {
  id: string;
  name: string;
  code: string;
  description: string;
  parentHubId: string;
  parentHubName: string;
  fighterCount: number; // Students
  intelCount: number;   // Questions
  integrity: number;    // A "Health" metric based on student performance
  status: "Active" | "Locked" | "Neutralized";
  createdAt: string;
}