
import React from 'react';
import { GeneratedItinerary } from '../types';
import { SearchIcon, GlobeIcon, CalendarIcon, MapPinIcon, HeartIcon, ShareIcon, EyeIcon } from './IconComponents';

interface CommunityScreenProps {
    trips: GeneratedItinerary[];
    onViewTrip: (trip: GeneratedItinerary) => void;
}

const CommunityTripCard: React.FC<{ trip: GeneratedItinerary; onView: () => void; }> = ({ trip, onView }) => {
    const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
                <img src={trip.cover_photo_url} alt={trip.trip_name} className="w-full h-48 object-cover" />
                <div className="p-5">
                    <h3 className="font-bold text-slate-800 text-xl mb-2">{trip.trip_name}</h3>
                     <div className="flex items-center space-x-3 mb-4">
                        <img src={trip.author.profilePhotoUrl} alt={trip.author.name} className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-medium text-slate-600">by {trip.author.name}</span>
                    </div>
                    <p className="text-sm text-slate-500 h-10 overflow-hidden mb-4">{trip.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
                         <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span>{formatDate(trip.start_date)}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span>{trip.locations}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-slate-50/70 flex justify-between items-center">
                 <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-500">
                        <HeartIcon className="w-4 h-4 mr-1.5 text-pink-400"/> {trip.likes}
                    </div>
                     <div className="flex items-center text-sm text-slate-500">
                        <ShareIcon className="w-4 h-4 mr-1.5 text-blue-400"/> {trip.shares}
                    </div>
                </div>
                <button onClick={onView} className="flex items-center text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg px-4 py-2 transition-colors">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Itinerary
                </button>
            </div>
        </div>
    );
};

export const CommunityScreen: React.FC<CommunityScreenProps> = ({ trips, onViewTrip }) => {
    return (
         <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Community Itineraries</h1>
                <p className="mt-1 text-slate-500">Get inspired by trips from fellow GlobalTrotters.</p>
            </div>

            <div className="flex space-x-2">
                <div className="relative flex-grow">
                    <SearchIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"/>
                    <input 
                        type="text"
                        placeholder="Search for destinations, themes, or users..."
                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </div>
            </div>
            
            {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map(trip => (
                        <CommunityTripCard key={trip.id} trip={trip} onView={() => onViewTrip(trip)} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <GlobeIcon className="w-20 h-20 mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700">Community is Quiet</h3>
                    <p className="text-slate-500 mt-1">No public trips have been shared yet. Be the first!</p>
                </div>
            )}
        </div>
    );
};
