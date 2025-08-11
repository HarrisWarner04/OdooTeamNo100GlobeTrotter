
import React, { useState, useMemo } from 'react';
import { GeneratedItinerary, TripStatus } from '../types';
import { SearchIcon, FilterIcon, CalendarIcon, MapPinIcon, ClockIcon, SunIcon, CheckCircleIcon, EyeIcon, MapIcon } from './IconComponents';

interface MyTripsScreenProps {
    trips: GeneratedItinerary[];
    onViewTrip: (trip: GeneratedItinerary) => void;
}

const getTripStatus = (trip: GeneratedItinerary): TripStatus => {
    const now = new Date();
    const startDate = new Date(trip.start_date + 'T00:00:00');
    const endDate = new Date(trip.end_date + 'T23:59:59');
    if (endDate < now) return 'completed';
    if (startDate <= now && endDate >= now) return 'ongoing';
    return 'upcoming';
};

const TripCard: React.FC<{ trip: GeneratedItinerary; onView: () => void; }> = ({ trip, onView }) => {
    const status = getTripStatus(trip);
    const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const statusInfo = {
        ongoing: { icon: SunIcon, text: 'Ongoing', color: 'text-orange-500', bg: 'bg-orange-100' },
        upcoming: { icon: ClockIcon, text: 'Upcoming', color: 'text-blue-500', bg: 'bg-blue-100' },
        completed: { icon: CheckCircleIcon, text: 'Completed', color: 'text-green-500', bg: 'bg-green-100' },
    };
    
    const CurrentStatusIcon = statusInfo[status].icon;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
                <img src={trip.cover_photo_url} alt={trip.trip_name} className="w-full h-40 object-cover" />
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-lg mb-2">{trip.trip_name}</h3>
                        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${statusInfo[status].bg} ${statusInfo[status].color}`}>
                            <CurrentStatusIcon className="w-3.5 h-3.5 mr-1.5" />
                            {statusInfo[status].text}
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 h-10 overflow-hidden mb-3">{trip.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 border-t border-slate-100 pt-3">
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span>{trip.locations}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-3 bg-slate-50/70 flex justify-end">
                <button onClick={onView} className="flex items-center text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg px-4 py-2 transition-colors">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Details
                </button>
            </div>
        </div>
    );
};

export const MyTripsScreen: React.FC<MyTripsScreenProps> = ({ trips, onViewTrip }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTrips = useMemo(() => {
        return trips.filter(trip => 
            trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.locations.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [trips, searchTerm]);

    const categorizedTrips = {
        ongoing: filteredTrips.filter(t => getTripStatus(t) === 'ongoing'),
        upcoming: filteredTrips.filter(t => getTripStatus(t) === 'upcoming'),
        completed: filteredTrips.filter(t => getTripStatus(t) === 'completed'),
    };
    
    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Trips</h1>
                <p className="mt-1 text-slate-500">All your adventures, organized in one place.</p>
            </div>

            <div className="flex space-x-2">
                <div className="relative flex-grow">
                    <SearchIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"/>
                    <input 
                        type="text"
                        placeholder="Search trips by name or destination..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
                    <FilterIcon className="w-4 h-4 mr-2"/>
                    Filter
                </button>
            </div>
            
            {(['ongoing', 'upcoming', 'completed'] as TripStatus[]).map(status => (
                categorizedTrips[status].length > 0 && (
                    <section key={status}>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 capitalize">{status} Trips</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categorizedTrips[status].map(trip => (
                                <TripCard key={trip.id} trip={trip} onView={() => onViewTrip(trip)} />
                            ))}
                        </div>
                    </section>
                )
            ))}

            {filteredTrips.length === 0 && (
                <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <MapIcon className="w-20 h-20 mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700">No Trips Found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your search or plan a new adventure!</p>
                </div>
            )}
        </div>
    );
};
