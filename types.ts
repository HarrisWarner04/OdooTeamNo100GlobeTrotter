

export type ActivityCategory = 'Food & Dining' | 'Attraction' | 'Transportation' | 'Accommodation' | 'Shopping' | 'Other' | 'Activity' | 'Hidden Gem';
export type TripStatus = 'upcoming' | 'ongoing' | 'completed';

export interface User {
  id: string;
  firstName: string;
  lastName:string;
  email: string;
  profilePhotoUrl: string;
  city: string;
  country: string;
  role: 'user' | 'admin';
}

export interface PublicProfile {
    id: string;
    name: string;
    profilePhotoUrl:string;
}

export interface TripPreferences {
  trip_name: string;
  start_date: string;
  end_date: string;
  locations: string;
  interests: string;
  pace: 'relaxed' | 'normal' | 'packed';
  budget_per_person: number;
  num_travelers: number;
  must_visits: string;
  description: string;
  cover_photo_url: string;
}

export interface Activity {
  id: string;
  title: string;
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  duration_minutes: number;
  cost: number;
  currency: "USD" | "EUR" | "INR";
  location: string;
  notes: string;
  confidence: "low" | "medium" | "high";
  category: ActivityCategory;
}

export interface DayPlan {
  id: string;
  date: string; // "YYYY-MM-DD"
  day_summary: string;
  activities: Activity[];
}

// GeneratedItinerary now includes all user preferences for easy editing and re-generation
export interface GeneratedItinerary extends TripPreferences {
  id: string;
  est_total_cost: number;
  currency: "USD" | "EUR" | "INR";
  days: DayPlan[];
  status: TripStatus;
  isPublic: boolean;
  author: PublicProfile;
  likes: number;
  shares: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  imageUrl: string;
}


// Add a helper function to create a default empty activity
export const createDefaultActivity = (): Activity => ({
  id: Date.now().toString() + Math.random(),
  title: '',
  start_time: '09:00',
  end_time: '10:00',
  duration_minutes: 60,
  cost: 0,
  currency: 'USD',
  location: '',
  notes: '',
  confidence: 'medium',
  category: 'Other',
});