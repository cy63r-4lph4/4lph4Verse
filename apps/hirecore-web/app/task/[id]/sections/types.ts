// app/task/[id]/sections/types.ts

/* ---------------------------- ENUM-LIKE TYPES ---------------------------- */

export type Urgency = "urgent" | "high" | "medium" | "low" | string;
export type ServiceType = "on-site" | "workshop" | string;
export type Status =
  | "open"
  | "under_review"
  | "assigned"
  | "pending_review"
  | "completed"
  | "cancelled"
  | string;

/* ------------------------------- MAIN TASK ------------------------------- */

export interface Task {
  id: number;
  title: string;
  description: string;

  // 👤 Client Info
  postedByProfile?: {
    avatar?: string;
    displayName?: string;
    handle?: string;
  };

  // 🧩 Participants
  hirer?: `0x${string}`;
  assignedTo?: `0x${string}`;

  // ⏱️ Meta
  postedTime: string;
  location?: string;
  timeEstimate?: string;
  category?: string;
  serviceType?: ServiceType;
  urgency?: Urgency;
  status?: Status;

  // 💰 Payment
  budget: number;

  // 🧠 Task Details
  attachments?: Attachment[];
  skills?: string[];

  // 📋 Applications & Bids
  applications?: Application[];
  bids?: Bid[];

  // 🚀 Progress & Completion
  milestones?: Milestone[];
  deliverables?: Deliverable[];

  // 🌍 Geolocation
  coordinates?: {
    lat?: number;
    lng?: number;
  };

  // ⭐ Feedback
  rating?: number;
  reviews?: number;
  views?: number;
}

/* ----------------------------- SUB INTERFACES ----------------------------- */

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface Application {
  applicant: string; 
  message?: string;
  createdAt: string;
}

export interface Bid {
  bidder: string; 
  bidAmount: number;
  message?: string;
  createdAt: string;
}

export interface Milestone {
  title: string;
  completed: boolean;
  approved?: boolean;
  dueDate?: string;
}

export interface Deliverable {
  files: string[]; 
  note?: string;
  submittedAt: string;
}
