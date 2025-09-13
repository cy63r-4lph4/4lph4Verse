export type TaskDisplayType = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates: { lat: number; lng: number };
  budget: number;
  timeEstimate: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  serviceType: 'on-site' | 'workshop';
  rating: number;
  reviews: number;
  postedBy: string;
  postedTime: string;
  skills: string[];
  status?:'pending'|'accepted'|'in-progress'|'completed'|'cancelled';
};
export type CategoryType = {
  value: string;
  label: string;
  icon: React.ElementType;
};
export type LocationType = {
  value: string;
  label: string;
};

export type UrgencyType = 'low' | 'medium' | 'high' | 'urgent';
export type ServiceType = 'on-site' | 'workshop';
export type SortOptionType = 'newest' | 'budget-asc' | 'budget-desc' | 'rating';