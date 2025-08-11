
import React from 'react';
import { GeneratedItinerary } from '../types';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, HeartIcon, ShareIcon, CopyIcon, ClockIcon, DollarSignIcon, InfoIcon, TagIcon } from './IconComponents';

interface PublicTripViewProps {
    trip: GeneratedItinerary;
    onBack: () => void;
    onCopyToMyTrips: (trip: GeneratedItinerary) => void;
}

export const PublicTripView: React.FC<PublicTripViewProps> = ({ trip, onBack, onCopyToMyTrips }) => {
    
    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
             <div className="flex items-center">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                    Back to Community
                </button>
            </div>

            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <img src={trip.cover_photo_url} alt={trip.trip_name} className="w-full h-64 object-cover rounded-xl mb-6"/>
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{trip.trip_name}</h1>
                         <div className="flex items-center space-x-3 my-3">
                            <img src={trip.author.profilePhotoUrl} alt={trip.author.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <span className="text-sm font-medium text-slate-700">by {trip.author.name}</span>
                                <p className="text-xs text-slate-500">{trip.locations}</p>
                            </div>
                        </div>
                        <p className="text-slate-500 mt-2 max-w-2xl">{trip.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 mt-2 md:mt-0">
                         <button onClick={() => alert('Shared!')} className="flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50">
                            <ShareIcon className="w-4 h-4 mr-2"/> Share
                        </button>
                         <button onClick={() => onCopyToMyTrips(trip)} className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-900">
                           <CopyIcon className="w-4 h-4 mr-2"/> Copy to My Trips
                        </button>
                    </div>
                </div>
            </div>

            {/* Itinerary */}
             <div className="space-y-6">
                {trip.days.map((day) => (
                    <div key={day.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50">
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-6 h-6 text-teal-600" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                                    <p className="text-sm text-slate-500">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 italic">"{day.day_summary}"</p>
                        </div>
                        <div className="p-4 space-y-4">
                            {day.activities.map((activity) => (
                                 <div key={activity.id} className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/80">
                                    <h4 className="font-semibold text-slate-800">{activity.title}</h4>
                                    <div className="mt-2 space-y-2 text-sm text-slate-600">
                                        <div className="flex items-center space-x-2"><ClockIcon className="w-4 h-4 text-slate-400" /><span>{activity.start_time} - {activity.end_time}</span></div>
                                        <div className="flex items-center space-x-2"><DollarSignIcon className="w-4 h-4 text-slate-400" /><span>{activity.cost} {activity.currency}</span></div>
                                        <div className="flex items-center space-x-2"><MapPinIcon className="w-4 h-4 text-slate-400" /><span>{activity.location}</span></div>
                                        {activity.notes && <div className="flex items-start space-x-2 pt-1"><InfoIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /><p className="italic">{activity.notes}</p></div>}
                                        <div className="flex items-center space-x-2 pt-1"><TagIcon className="w-4 h-4 text-slate-400" /><span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">{activity.category}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};
