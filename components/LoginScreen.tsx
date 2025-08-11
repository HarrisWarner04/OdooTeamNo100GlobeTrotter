
import React, { useState } from 'react';
import { PlaneIcon, UserIcon, LockIcon, GoogleIcon } from './IconComponents';

interface LoginScreenProps {
  onLogin: (email: string, pass: string) => void;
  onNavigateRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateRegister }) => {
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleGoogleLogin = () => {
    onLogin('user@google.com', 'google_auth_placeholder');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-slate-800 p-3 rounded-xl">
                <PlaneIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                GlobalTrotter
              </h1>
            </div>
            <p className="text-slate-500">Welcome back! Please log in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
                <MailIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"/>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </div>
            <div className="relative">
                <LockIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"/>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
            </div>
            
            <div className="text-right">
                <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                  Forgot Password?
                </a>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Log In
            </button>
            
            <div className="text-center">
                <button type="button" onClick={onNavigateRegister} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Don't have an account? <span className="font-semibold text-teal-600">Sign Up</span>
                </button>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">Powered by Soulful Heron AI</p>
      </div>
    </div>
  );
};

// Need to add MailIcon to IconComponents
const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
