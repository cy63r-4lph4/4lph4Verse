export type Urgency = "urgent" | "high" | "medium" | "low" | string;
export type ServiceType = "on-site" | "workshop" | string;
export type Status = "open" | "assigned" | "completed" | "cancelled" | string;


export type Task = {
id: number;
title: string;
description: string;
postedByProfile?: {
  avatar?: string;
  displayName?: string;
  handle?: string;
};
hirer?: `0x${string}`;
postedTime: string;
location?: string;
timeEstimate?: string;
budget: number;
attachments?: {
name: string;
url: string;
type: string;
}[];
applications?: any[];
bids?: any[];
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