
import React, { useState } from 'react';
import { TripPreferences, GeneratedItinerary } from '../types';
import { TripForm } from './TripForm';
import { ItineraryDisplay } from './ItineraryDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { GlobeIcon } from './IconComponents';

interface PlannerScreenProps {
    onGenerate: (preferences: TripPreferences) => void;
    itinerary: GeneratedItinerary | null;
    isLoading: boolean;
    error: string | null;
    onSave: (itinerary: GeneratedItinerary) => void;
    onDiscard: () => void;
    creationData: { tripName: string, startDate: string, endDate: string, description: string, coverPhotoUrl: string, locations: string } | null;
}

const defaultPreferences: TripPreferences = {
    locations: 'Paris, France',
    interests: 'Art, history, and culinary experiences',
    pace: 'normal',
    budget_per_person: 2000,
    num_travelers: 2,
    must_visits: 'Eiffel Tower, Louvre Museum',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0],
    cover_photo_url: 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max',
    description: 'A romantic getaway exploring the best of Paris.',
    trip_name: 'Parisian Dreams',
};

export const PlannerScreen: React.FC<PlannerScreenProps> = ({ onGenerate, itinerary, isLoading, error, onSave, onDiscard, creationData }) => {
    const [preferences, setPreferences] = useState<TripPreferences>(() => {
        const basePrefs = { ...defaultPreferences };
        if (creationData) {
            return {
                ...basePrefs,
                trip_name: creationData.tripName,
                start_date: creationData.startDate,
                end_date: creationData.endDate,
                description: creationData.description,
                cover_photo_url: creationData.coverPhotoUrl,
                locations: creationData.locations,
            };
        }
        return basePrefs;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-4 xl:col-span-3">
              <TripForm
                preferences={preferences}
                setPreferences={setPreferences}
                onGenerate={() => onGenerate(preferences)}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              {isLoading && <LoadingSpinner />}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">Generation Failed: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {itinerary ? (
                <ItineraryDisplay itinerary={itinerary} onDiscard={onDiscard} onSave={onSave} />
              ) : (
                !isLoading && !error && (
                  <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                    <GlobeIcon className="w-24 h-24 text-teal-500 mb-6" />
                    <h2 className="text-2xl font-bold text-slate-800">Your Adventure Awaits</h2>
                    <p className="mt-2 text-slate-500 max-w-md">
                      Refine the travel details on the left and let our AI Trip Concierge craft the perfect itinerary for you.
                    </p>
                  </div>
                )
              )}
            </div>
        </div>
    );
};
