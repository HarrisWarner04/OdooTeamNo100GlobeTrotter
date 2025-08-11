
import { User, GeneratedItinerary } from '../types';

export const MOCK_USER: User = {
    id: 'user-1',
    firstName: 'Alex',
    lastName: 'Done',
    email: 'alex@example.com',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max',
    city: 'New York',
    country: 'USA',
    role: 'admin',
};

const commonAuthor = { id: 'user-1', name: 'Alex Done', profilePhotoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max' };

const createMockTrip = (id: string, name: string, details: Partial<GeneratedItinerary>): GeneratedItinerary => ({
  id,
  trip_name: name,
  start_date: '2024-08-01',
  end_date: '2024-08-08',
  locations: 'Paris, France',
  interests: 'History, Food, Art',
  pace: 'normal',
  budget_per_person: 2500,
  num_travelers: 2,
  must_visits: 'Eiffel Tower, Louvre',
  description: `An amazing journey through the heart of ${details.locations || 'the city'}.`,
  cover_photo_url: 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max',
  est_total_cost: 5000,
  currency: 'USD',
  days: [
    { id: 'day-1', date: '2024-08-01', day_summary: 'Arrival and exploration of Montmartre.', activities: [
        { id: 'act-1', title: 'Check-in to Hotel', start_time: '14:00', end_time: '15:00', duration_minutes: 60, cost: 200, currency: 'USD', location: 'Hotel in Montmartre', notes: 'Boutique hotel with great reviews.', confidence: 'high', category: 'Accommodation' },
        { id: 'act-2', title: 'Dinner at Le Consulat', start_time: '19:00', end_time: '20:30', duration_minutes: 90, cost: 80, currency: 'USD', location: 'Montmartre', notes: 'Classic French bistro.', confidence: 'high', category: 'Food & Dining' },
    ]},
    { id: 'day-2', date: '2024-08-02', day_summary: 'Museum day: Louvre and Musée d\'Orsay.', activities: [] },
  ],
  status: 'upcoming',
  isPublic: false,
  author: commonAuthor,
  likes: 0,
  shares: 0,
  ...details,
});

export const MOCK_TRIPS: GeneratedItinerary[] = [
    createMockTrip('trip-1', 'Parisian Adventure', {
        status: 'upcoming',
        start_date: '2024-09-10',
        end_date: '2024-09-17',
    }),
    createMockTrip('trip-2', 'Roman Holiday', {
        locations: 'Rome, Italy',
        cover_photo_url: 'https://images.unsplash.com/photo-1529260830199-42c24129f196?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max',
        status: 'completed',
        start_date: '2024-05-20',
        end_date: '2024-05-27',
    }),
    createMockTrip('trip-3', 'Tokyo Drift', {
        locations: 'Tokyo, Japan',
        cover_photo_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max',
        status: 'upcoming',
        start_date: '2024-10-01',
        end_date: '2024-10-10',
    }),
];

export const MOCK_COMMUNITY_TRIPS: GeneratedItinerary[] = [
    createMockTrip('comm-trip-1', 'Exploring the Alps', {
        locations: 'Swiss Alps, Switzerland',
        cover_photo_url: 'https://images.unsplash.com/photo-1506934431220-829144358742?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max',
        isPublic: true,
        author: {id: 'user-2', name: 'Sarah Lane', profilePhotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max'},
        likes: 128,
        shares: 42,
    }),
    createMockTrip('comm-trip-2', 'Coastal Drive in California', {
        locations: 'California, USA',
        cover_photo_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max',
        isPublic: true,
        author: {id: 'user-3', name: 'Mike Johnson', profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max'},
        likes: 256,
        shares: 89,
    }),
];

export const MOCK_USERS_LIST: User[] = [
    MOCK_USER,
    { id: 'user-2', firstName: 'Sarah', lastName: 'Lane', email: 'sarah@example.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max', city: 'London', country: 'UK', role: 'user'},
    { id: 'user-3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max', city: 'Los Angeles', country: 'USA', role: 'user'},
];
