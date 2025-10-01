// For your React form state
export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  serviceType: string;
  location: string;
  coordinates: { lat: string; lng: string };
  skills: string;           // comma-separated input
  budget: string;           // raw input as string
  timeEstimate: string;
  duration: string;         // raw input as string
  attachments: string[];
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
  attachments: string[];
  paymentToken: string;
}
