export type Urgency = "urgent" | "high" | "medium" | "low" | string;
export type ServiceType = "on-site" | "workshop" | string;
export type Status = "open" | "assigned" | "completed" | "cancelled" | string;


export interface Task {
id: number;
title: string;
description: string;
postedBy: string; // "You" | other name
postedTime: string;
location?: string;
timeEstimate?: string;
budget: number;
serviceType?: ServiceType;
urgency?: Urgency;
status?: Status;
skills?: string[];
rating?: number;
reviews?: number;
coordinates?: {
lat?: number;
lng?: number;
};
}