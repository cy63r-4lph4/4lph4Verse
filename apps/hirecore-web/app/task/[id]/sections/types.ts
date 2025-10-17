export type Urgency = "urgent" | "high" | "medium" | "low" | string;
export type ServiceType = "on-site" | "workshop" | string;
export type Status = "open" | "assigned" | "completed" | "cancelled" | string;


export type Task = {
id: number;
title: string;
description: string;
postedBy: string; 
postedTime: string;
location?: string;
timeEstimate?: string;
budget: number;
category?: string;
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