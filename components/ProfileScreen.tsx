
import React from 'react';
import { User, GeneratedItinerary } from '../types';
import { SettingsIcon, MapPinIcon, MailIcon, EyeIcon } from './IconComponents';

interface ProfileScreenProps {
    user: User;
    trips: GeneratedItinerary[];
    onNavigateToSettings: () => void;
    onViewTrip: (trip: GeneratedItinerary) => void;
}

const TripCard: React.FC<{ trip: GeneratedItinerary; onView: () => void; }> = ({ trip, onView }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
        <img src={trip.cover_photo_url} alt={trip.trip_name} className="w-full h-28 object-cover"/>
        <div className="p-3">
            <h4 className="font-bold text-sm text-slate-800 truncate">{trip.trip_name}</h4>
            <p className="text-xs text-slate-500 truncate">{trip.locations}</p>
        </div>
        <div className="p-2 border-t border-slate-100 flex justify-end">
            <button onClick={onView} className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md px-2.5 py-1.5 transition-colors">
                <EyeIcon className="w-3.5 h-3.5 mr-1.5" />
                View
            </button>
        </div>
    </div>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, trips, onNavigateToSettings, onViewTrip }) => {
    const upcomingTrips = trips.filter(t => new Date(t.end_date) >= new Date());
    const previousTrips = trips.filter(t => new Date(t.end_date) < new Date());

    return (
        <div className="max-w-5xl mx-auto animate-fade-in space-y-8">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img src={user.profilePhotoUrl} alt={`${user.firstName} ${user.lastName}`} className="w-28 h-28 rounded-full border-4 border-white shadow-lg"/>
                <div className="flex-grow text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-800">{user.firstName} {user.lastName}</h1>
                    <div className="flex items-center justify-center sm:justify-start space-x-4 text-slate-500 mt-2">
                        <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1.5"/>
                            <span>{user.city}, {user.country}</span>
                        </div>
                         <div className="flex items-center">
                            <MailIcon className="w-4 h-4 mr-1.5"/>
                            <span>{user.email}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onNavigateToSettings} className="flex-shrink-0 flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                    <SettingsIcon className="w-4 h-4 mr-2"/>
                    Edit Profile & Settings
                </button>
            </div>
            
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Preplanned Trips</h2>
                {upcomingTrips.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} onView={() => onViewTrip(trip)} />)}
                    </div>
                ) : (
                    <p className="text-slate-500 bg-white p-6 rounded-xl border border-slate-200 text-center">No upcoming trips planned. Time for a new adventure!</p>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Previous Trips</h2>
                 {previousTrips.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previousTrips.map(trip => <TripCard key={trip.id} trip={trip} onView={() => onViewTrip(trip)} />)}
                    </div>
                ) : (
                    <p className="text-slate-500 bg-white p-6 rounded-xl border border-slate-200 text-center">No completed trips yet.</p>
                )}
            </section>
        </div>
    );
};
