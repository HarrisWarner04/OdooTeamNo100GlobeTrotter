
import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeftIcon } from './IconComponents';

interface SettingsScreenProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onBack: () => void;
}

const InputField: React.FC<{
  label: string;
  id: keyof Omit<User, 'id' | 'role' | 'profilePhotoUrl'>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, id, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <input type="text" id={id} name={id} value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"/>
    </div>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onUpdateUser, onBack }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateUser(formData);
      // In a real app, you might show a success toast here
      alert("Profile updated successfully!");
  }
  
  const handleDeleteAccount = () => {
      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
          console.log("Deleting account...");
          // In a real app, this would trigger an API call and logout.
          alert("Account deleted.");
      }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
        <div className="flex items-center">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                Back to Profile
            </button>
        </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">Profile Information</h1>
            <p className="text-slate-500 mt-1">Update your personal details here.</p>
        </div>
        <form onSubmit={handleSaveChanges}>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" id="firstName" value={formData.firstName} onChange={handleChange} />
                    <InputField label="Last Name" id="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <InputField label="Email Address" id="email" value={formData.email} onChange={handleChange} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="City" id="city" value={formData.city} onChange={handleChange} />
                    <InputField label="Country" id="country" value={formData.country} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-slate-700">Language</label>
                  <select id="language" name="language" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                      <option>English</option>
                      <option disabled>Spanish (coming soon)</option>
                      <option disabled>French (coming soon)</option>
                  </select>
                </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end rounded-b-2xl">
                 <button type="submit" className="px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                    Save Changes
                </button>
            </div>
        </form>
      </div>

       <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="py-1"><h3 className="font-bold text-red-800">Danger Zone</h3></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="text-sm text-red-700">
                Deleting your account is permanent and will remove all your data, including saved trips.
              </p>
            </div>
            <button onClick={handleDeleteAccount} className="ml-4 flex-shrink-0 px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete Account
            </button>
          </div>
        </div>
    </div>
  );
};
