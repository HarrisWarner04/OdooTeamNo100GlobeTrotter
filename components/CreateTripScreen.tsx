import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from './IconComponents';

interface CreateTripScreenProps {
  onContinue: (data: { tripName: string, startDate: string, endDate: string, description: string, coverPhotoUrl: string, locations: string }) => void;
  onBack: () => void;
}

const coverPhotos = [
  { id: 'photo1', url: 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', alt: 'Eiffel Tower in Paris' },
  { id: 'photo2', url: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', alt: 'Fushimi Inari Shrine in Kyoto' },
  { id: 'photo3', url: 'https://images.unsplash.com/photo-1543783207-9634d5861834?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', alt: 'Cinque Terre, Italy' },
  { id: 'photo4', url: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', alt: 'Beach in Bali' },
  { id: 'photo5', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', alt: 'Louvre Museum in Paris' },
  { id: 'photo6', url: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max', alt: 'Santorini, Greece' },
];

export const CreateTripScreen: React.FC<CreateTripScreenProps> = ({ onContinue, onBack }) => {
  const [tripName, setTripName] = useState('');
  const [locations, setLocations] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(coverPhotos[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName.trim() || !locations.trim() || !description.trim()) {
      setError('Please fill out all fields before continuing.');
      return;
    }
    setError('');
    onContinue({
      tripName,
      startDate,
      endDate,
      description,
      coverPhotoUrl: selectedPhoto.url,
      locations
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                <ArrowLeftIcon className="w-5 h-5 text-slate-600"/>
            </button>
            <div className="ml-2">
                <h1 className="text-2xl font-bold text-slate-800">Create a New Trip</h1>
                <p className="text-slate-500">Let's get started with the basics. You'll use AI to refine the details next.</p>
            </div>
        </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Column 1: Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="tripName" className="block text-sm font-medium text-slate-700 mb-1">Trip Name</label>
              <input type="text" id="tripName" value={tripName} onChange={e => setTripName(e.target.value)} placeholder="e.g., Italian Summer Adventure" required className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>
            
            <div>
              <label htmlFor="locations" className="block text-sm font-medium text-slate-700 mb-1">Primary Destination</label>
              <input type="text" id="locations" value={locations} onChange={e => setLocations(e.target.value)} placeholder="e.g, Rome, Italy" required className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"/>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} required className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500" />
                </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Trip Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe the main goals and interests for your trip. e.g., 'A relaxed trip focusing on ancient history, authentic food, and scenic walks.'" required className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"></textarea>
            </div>
          </div>

          {/* Column 2: Cover Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Choose a Cover Photo</label>
            <div className="grid grid-cols-3 gap-2">
              {coverPhotos.map(photo => (
                <div key={photo.id} className="relative cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  <img src={photo.url} alt={photo.alt} className="w-full h-24 object-cover rounded-md" />
                  {selectedPhoto.id === photo.id && (
                    <div className="absolute inset-0 bg-teal-600/70 flex items-center justify-center rounded-md">
                      <CheckCircleIcon className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Full-width submit button */}
          <div className="md:col-span-2">
             {error && <p className="text-sm text-red-500 mb-3 text-center">{error}</p>}
            <button type="submit" className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
              Continue to AI Planner <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};