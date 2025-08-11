
import React, {useState} from 'react';
import { GeneratedItinerary } from '../types';
import { SparklesIcon, CalendarIcon, MapPinIcon, ArrowRightIcon, SearchIcon, MapIcon } from './IconComponents';

interface DashboardProps {
    userName: string;
    recentTrips: GeneratedItinerary[];
    onPlanNewTrip: () => void;
    onViewMyTrips: () => void;
    onSearch: (query: string) => void;
}

const recommendedDestinations = [
    { name: 'Kyoto, Japan', img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max' },
    { name: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max' },
    { name: 'Bali, Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max' },
    { name: 'New York, USA', img: 'https://images.unsplash.com/photo-1546436836-07a91091f160?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max' },
]

const TripCard: React.FC<{ trip: GeneratedItinerary; }> = ({ trip }) => {
    const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <img src={trip.cover_photo_url} alt={`Cover for ${trip.trip_name}`} className="w-full h-32 object-cover" />
        <div className="p-4">
            <h3 className="font-bold text-slate-800 truncate">{trip.trip_name}</h3>
            <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                <div className="flex items-center">
                    <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                    <span>{formatDate(trip.start_date)}</span>
                </div>
            </div>
        </div>
    </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ userName, recentTrips, onPlanNewTrip, onViewMyTrips, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="relative bg-slate-800 rounded-2xl shadow-lg overflow-hidden p-8 md:p-12 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-transparent opacity-80"></div>
                <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1600&fit=max" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Banner"/>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold">Welcome, {userName}!</h1>
                    <p className="mt-2 text-slate-300 max-w-lg">Your journey begins here. Let's create unforgettable memories, one trip at a time.</p>
                     <button
                        onClick={onPlanNewTrip}
                        className="mt-6 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-slate-900 bg-white hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white transition-colors"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2 text-teal-500" />
                        Plan a New Trip with AI
                    </button>
                </div>
            </div>

             {/* Search Section */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">Explore Destinations</h2>
                <form onSubmit={handleSearchSubmit} className="relative">
                    <SearchIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-4 -translate-y-1/2"/>
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for activities in any city, e.g., 'things to do in Rome'"
                        className="w-full pl-12 pr-32 py-4 bg-white border border-slate-300 rounded-xl text-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-slate-800 hover:bg-slate-900 transition-colors">
                        Search
                    </button>
                </form>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800">Previous Trips</h2>
                            <button onClick={onViewMyTrips} className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-700">
                                View All <ArrowRightIcon className="w-4 h-4 ml-1"/>
                            </button>
                        </div>
                        {recentTrips.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {recentTrips.map(trip => (
                                    <TripCard 
                                        key={trip.id} 
                                        trip={trip}
                                    />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
                                <MapIcon className="w-16 h-16 mx-auto text-slate-300" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-700">No Trips Yet</h3>
                                <p className="text-slate-500 mt-1">Start by planning a new trip to see it here.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Top Regional Selections</h2>
                        <div className="space-y-3">
                            {recommendedDestinations.map(dest => (
                                <div key={dest.name} onClick={() => onSearch(dest.name)} className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
                                    <img src={dest.img} alt={dest.name} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                                    <p className="absolute bottom-2 left-3 font-bold text-white text-md tracking-wide">{dest.name}</p>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};
