import { Task } from "@verse/hirecore-web/app/task/[id]/sections/types";

// For your React form state
export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  serviceType: string;
  location: string;
  coordinates: { lat: string; lng: string };
  skills: string;           
  budget: string;           // raw input as string
  timeEstimate: string;
  duration: string;         // raw input as string
  attachments: (string | File)[];
  paymentToken: string;
}

export interface TaskPayload {
  title: string;
  description: string;
  category: string;
  urgency: string;
  serviceType: string;
  location: string;
  coordinates: { lat: string; lng: string };
  skills: string[];         
  budget: number;           
  timeEstimate: string;
  duration?: number;
  attachments: (string | File)[];
  paymentToken: string;
}
export interface TaskPost {
  id: number;
  hirer: `0x${string}`;
  paymentToken: `0x${string}`;
  budget: number;
  deposit: number;
  expiry: number;
  metadata: Record<string, unknown>;
  category: string;
  location: string;
  urgency: string;
}

// export interface TaskMetadata {
//   verse: { verseId: number; address: `0x${string}`; handle?: string };
//   title: string;
//   description: string;
//   category?: string;
//   urgency?: string;
//   serviceType?: string;
//   location?: string;
//   coordinates?: [number, number];
//   skills?: string[];
//   attachments?: string[];
//   budget?: number | string;
//   timeEstimate?: string;
//   version: string;
//   createdAt: string;
// }

export interface HireCoreTask {
  id: number;
  hirer: `0x${string}`;
  budget: number;
  deposit: number;
  expiry: number;
  metadata: {
    title: string;
    description: string;
    category?: string;
    location?: string;
    urgency?: string;
  };
  postedBy?: string;
  postedTime?: string;
  skills?: string[];
  coordinates?: { lat: number; lng: number };
  paymentToken: `0x${string}`;
  timeEstimate?: string | null;
  serviceType?: string | null;
  rating?: number | null;
  reviews?: number | null;
  status?: "open" | "assigned" | "completed" | "cancelled";
  category: string;
  location: string;
  urgency: string;
}

export interface TaskCardProps {
  task: Task; 
    index?: number;
  }

export interface Attachment {
  name: string;
  url: string;
  type?: string;
}

export interface WorkerProfile {
  id: number;
  name: string;
  handle: string;
  avatar?: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  skills: string[];
  hourlyRate?: number;
  experience?: string;
}

export interface TaskMetadata {
  verse: {
    verseId: string | number;
    address: string;
  };
  title: string;
  description: string;
  category?: string;
  urgency?: string;
  serviceType?: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  skills?: string[];
  attachments?: {
    name: string;
    url: string;
    type?: string;
  }[];
  budget: number;
  timeEstimate?: string;
  version: string;
  createdAt: string;
}
