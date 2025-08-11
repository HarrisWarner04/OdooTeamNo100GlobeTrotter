import React, { useState } from 'react';
import { GeneratedItinerary, DayPlan, Activity, createDefaultActivity } from '../types';
import { 
    ArrowLeftIcon, CalendarIcon, ClockIcon, DollarSignIcon, MapPinIcon, InfoIcon, 
    PencilIcon, TrashIcon, SparklesIcon, PlusCircleIcon, TagIcon, WalletIcon, ListIcon 
} from './IconComponents';
import { ActivityEditorModal } from './ActivityEditorModal';
import { BudgetView } from './BudgetView';
import { CalendarView } from './CalendarView';

// --- Sub-components specific to TripDetail ---

const ActivityCard: React.FC<{ activity: Activity; isEditing: boolean; onEdit: () => void; onDelete: () => void; }> = ({ activity, isEditing, onEdit, onDelete }) => (
    <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-200/80 relative group">
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-800 pr-16">{activity.title}</h4>
            {isEditing && (
                <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800 transition-colors" aria-label="Edit activity">
                        <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={onDelete} className="p-1.5 rounded-full bg-slate-200 hover:bg-red-200 text-slate-600 hover:text-red-700 transition-colors" aria-label="Delete activity">
                        <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
        <div className="mt-2 space-y-2 text-sm text-slate-600">
             <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-slate-400" />
                <span>{activity.start_time} - {activity.end_time} ({activity.duration_minutes} mins)</span>
            </div>
            <div className="flex items-center space-x-2">
                <DollarSignIcon className="w-4 h-4 text-slate-400" />
                <span>{activity.cost} {activity.currency}</span>
            </div>
            <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-slate-400" />
                <span>{activity.location}</span>
            </div>
            {activity.notes && (
                <div className="flex items-start space-x-2 pt-1">
                    <InfoIcon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <p className="italic">{activity.notes}</p>
                </div>
            )}
             <div className="flex items-center space-x-2 pt-1">
                <TagIcon className="w-4 h-4 text-slate-400" />
                <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">{activity.category}</span>
                    <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-medium ${activity.confidence === 'high' ? 'bg-green-100 text-green-800' : activity.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {activity.confidence} confidence
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const DayCard: React.FC<{ day: DayPlan; isEditing: boolean; onUpdateDay: (updatedDay: DayPlan) => void; }> = ({ day, isEditing, onUpdateDay }) => {
    const date = new Date(day.date + 'T00:00:00');
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    const handleAddActivity = () => {
        setEditingActivity(createDefaultActivity());
    };

    const handleSaveActivity = (updatedActivity: Activity) => {
        const existingIndex = day.activities.findIndex(a => a.id === updatedActivity.id);
        let newActivities;
        if (existingIndex > -1) {
            newActivities = day.activities.map(a => a.id === updatedActivity.id ? updatedActivity : a);
        } else {
            newActivities = [...day.activities, updatedActivity];
        }
        onUpdateDay({ ...day, activities: newActivities });
        setEditingActivity(null);
    };

    const handleDeleteActivity = (activityId: string) => {
        const newActivities = day.activities.filter(a => a.id !== activityId);
        onUpdateDay({ ...day, activities: newActivities });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                    <div className="flex items-center space-x-3">
                        <CalendarIcon className="w-6 h-6 text-teal-600" />
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">{dayOfWeek}</h3>
                            <p className="text-sm text-slate-500">{formattedDate}</p>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 italic">"{day.day_summary}"</p>
                </div>
                {isEditing && (
                    <button onClick={handleAddActivity} className="flex items-center px-3 py-1.5 border border-dashed border-slate-400 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-100 hover:border-solid hover:border-slate-500 transition-all">
                        <PlusCircleIcon className="w-4 h-4 mr-2"/>
                        Add Activity
                    </button>
                )}
            </div>
            <div className="p-4 space-y-4">
                {day.activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} isEditing={isEditing} onEdit={() => setEditingActivity(activity)} onDelete={() => handleDeleteActivity(activity.id)} />
                ))}
                {day.activities.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No activities planned for this day.</p>}
            </div>
            {editingActivity && (
                <ActivityEditorModal 
                    activity={editingActivity}
                    isOpen={!!editingActivity}
                    onClose={() => setEditingActivity(null)}
                    onSave={handleSaveActivity}
                />
            )}
        </div>
    );
};

// --- Main Component ---

interface TripDetailProps {
    trip: GeneratedItinerary;
    onBack: () => void;
    onUpdateTrip: (updatedTrip: GeneratedItinerary) => void;
    onDeleteTrip: () => void;
    onEditWithAI: () => void;
}

const TabButton: React.FC<{
  name: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}> = ({ name, icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none ${
      isActive
        ? 'border-teal-500 text-teal-600'
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    <Icon className={`w-5 h-5 mr-2 ${isActive ? 'text-teal-500' : 'text-slate-400'}`} />
    {name}
  </button>
);


export const TripDetail: React.FC<TripDetailProps> = ({ trip, onBack, onUpdateTrip, onDeleteTrip, onEditWithAI }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftTrip, setDraftTrip] = useState<GeneratedItinerary | null>(null);
    const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'calendar'>('itinerary');

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing
            setIsEditing(false);
            setDraftTrip(null);
        } else {
            // Start editing
            setDraftTrip(JSON.parse(JSON.stringify(trip))); // Deep copy for safe editing
            setIsEditing(true);
        }
    };
    
    const handleSaveChanges = () => {
        if (draftTrip) {
            onUpdateTrip(draftTrip);
            setIsEditing(false);
            setDraftTrip(null);
        }
    };

    const handleDayUpdate = (updatedDay: DayPlan) => {
        if (draftTrip) {
            const updatedDays = draftTrip.days.map(d => d.id === updatedDay.id ? updatedDay : d);
            setDraftTrip({ ...draftTrip, days: updatedDays });
        }
    };

    const displayTrip = isEditing && draftTrip ? draftTrip : trip;

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'budget':
                return <BudgetView trip={displayTrip} />;
            case 'calendar':
                return <CalendarView trip={displayTrip} />;
            case 'itinerary':
            default:
                return (
                    <div className="space-y-6">
                        {displayTrip.days.map((day) => (
                            <DayCard key={day.id} day={day} isEditing={isEditing} onUpdateDay={handleDayUpdate} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center mb-2">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                    Back to Dashboard
                </button>
            </div>

            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{displayTrip.trip_name}</h1>
                        <p className="text-slate-500 mt-2 max-w-2xl">{displayTrip.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 mt-2 md:mt-0">
                        {isEditing ? (
                            <>
                                <button onClick={handleEditToggle} className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">Cancel</button>
                                <button onClick={handleSaveChanges} className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors">Save Changes</button>
                            </>
                        ) : (
                            <>
                                <button onClick={onDeleteTrip} className="p-2 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors" aria-label="Delete trip"><TrashIcon className="w-4 h-4"/></button>
                                <button onClick={onEditWithAI} className="flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                                    <SparklesIcon className="w-4 h-4 mr-2"/> Edit with AI
                                </button>
                                <button onClick={handleEditToggle} className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-700 hover:bg-slate-800 transition-colors">
                                    <PencilIcon className="w-4 h-4 mr-2"/> Edit Itinerary
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <TabButton name="Itinerary" icon={ListIcon} isActive={activeTab === 'itinerary'} onClick={() => setActiveTab('itinerary')} />
                    <TabButton name="Budget" icon={WalletIcon} isActive={activeTab === 'budget'} onClick={() => setActiveTab('budget')} />
                    <TabButton name="Calendar" icon={CalendarIcon} isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                </nav>
            </div>
            
            {/* Tab Content */}
            <div className="mt-6">
                {renderActiveTabContent()}
            </div>
        </div>
    );
};