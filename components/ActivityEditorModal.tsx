import React, { useState, useEffect } from 'react';
import { Activity, ActivityCategory } from '../types';

interface ActivityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  activity: Activity;
}

const categories: ActivityCategory[] = ['Food & Dining', 'Attraction', 'Transportation', 'Accommodation', 'Shopping', 'Other'];

const InputField: React.FC<{
  label: string;
  id: keyof Activity;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  as?: 'input' | 'textarea' | 'select';
}> = ({ label, id, value, onChange, type = 'text', as = 'input' }) => {
  const commonClasses = "block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500";
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {as === 'textarea' ? (
        <textarea id={id} name={id} value={value} onChange={onChange} rows={3} className={commonClasses} />
      ) : (
        <input type={type} id={id} name={id} value={value} onChange={onChange} className={commonClasses} />
      )}
    </div>
  );
};


export const ActivityEditorModal: React.FC<ActivityEditorModalProps> = ({ isOpen, onClose, onSave, activity }) => {
  const [formData, setFormData] = useState<Activity>(activity);

  useEffect(() => {
    setFormData(activity);
  }, [activity]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{activity.title ? 'Edit Activity' : 'Add New Activity'}</h3>
                <div className="space-y-4">
                    <InputField label="Title" id="title" value={formData.title} onChange={handleChange} />
                    <InputField label="Location" id="location" value={formData.location} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-4">
                         <InputField label="Start Time" id="start_time" type="time" value={formData.start_time} onChange={handleChange} />
                         <InputField label="End Time" id="end_time" type="time" value={formData.end_time} onChange={handleChange} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <InputField label="Cost" id="cost" type="number" value={formData.cost} onChange={handleChange} />
                         <InputField label="Duration (minutes)" id="duration_minutes" type="number" value={formData.duration_minutes} onChange={handleChange} />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      >
                          {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                          ))}
                      </select>
                    </div>
                     <InputField label="Notes" id="notes" as="textarea" value={formData.notes} onChange={handleChange} />
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 flex justify-end items-center space-x-3 rounded-b-2xl">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors">
                    Save Activity
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};