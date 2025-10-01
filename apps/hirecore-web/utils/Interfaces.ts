export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  serviceType: string;
  location: string;
  coordinates: { lat: string; lng: string };
  skills: string;
  budget: string;
  timeEstimate: string;
  duration: string; 
  attachments:string[];
  paymentToken: string;
}
