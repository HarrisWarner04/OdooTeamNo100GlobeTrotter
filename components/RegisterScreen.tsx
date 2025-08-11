
import React, { useState } from 'react';
import { User } from '../types';
import { PlaneIcon, UserIcon, LockIcon, MailIcon, PhoneIcon, GlobeIcon } from './IconComponents';

interface RegisterScreenProps {
  onRegister: (details: Omit<User, 'id' | 'role' | 'profilePhotoUrl'>) => void;
  onNavigateLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onNavigateLogin }) => {
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      city: '',
      country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { password, phone, ...rest } = formData;
    onRegister({ ...rest });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 animate-fade-in">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-slate-800 p-3 rounded-xl">
                <PlaneIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Create Your Account
              </h1>
            </div>
            <p className="text-slate-500">Join GlobalTrotter to plan and share your adventures.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithIcon icon={UserIcon} name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                <InputWithIcon icon={UserIcon} name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
            </div>
            <InputWithIcon icon={MailIcon} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <InputWithIcon icon={LockIcon} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithIcon icon={PhoneIcon} name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required={false}/>
                <InputWithIcon icon={GlobeIcon} name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
            </div>
            <InputWithIcon icon={MapPinIcon} name="city" placeholder="City" value={formData.city} onChange={handleChange} />

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Register
            </button>
            
            <div className="text-center">
                <button type="button" onClick={onNavigateLogin} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Already have an account? <span className="font-semibold text-teal-600">Log In</span>
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const InputWithIcon: React.FC<{
    icon: React.ElementType,
    name: string,
    value: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    required?: boolean
}> = ({ icon: Icon, name, value, placeholder, onChange, type = 'text', required = true }) => (
    <div className="relative">
        <Icon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"/>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
    </div>
);

const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
