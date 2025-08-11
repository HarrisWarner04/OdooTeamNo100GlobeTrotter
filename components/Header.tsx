
import React, { useState, useRef, useEffect } from 'react';
import { User, PublicProfile } from '../types';
import { View } from '../App';
import { PlaneIcon, ChevronDownIcon, UserCircleIcon, LogOutIcon, LayoutDashboardIcon, MapIcon, UsersIcon, SettingsIcon } from './IconComponents';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    navigate: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, navigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const menuItems = [
    { label: 'My Trips', icon: MapIcon, view: 'myTrips' as View },
    { label: 'Profile', icon: UserCircleIcon, view: 'profile' as View },
    { label: 'Community', icon: UsersIcon, view: 'community' as View },
    { label: 'Settings', icon: SettingsIcon, view: 'settings' as View },
  ];
  
  if (user.role === 'admin') {
      menuItems.push({ label: 'Admin', icon: LayoutDashboardIcon, view: 'admin' as View });
  }

  return (
    <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('dashboard')}>
            <div className="bg-slate-800 p-2 rounded-lg">
                <PlaneIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              GlobalTrotter
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <nav className="hidden md:flex items-center space-x-2">
                <a onClick={() => navigate('dashboard')} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer">Dashboard</a>
                <a onClick={() => navigate('myTrips')} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer">My Trips</a>
                <a onClick={() => navigate('community')} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer">Community</a>
            </nav>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2 p-1 pr-2 rounded-full hover:bg-slate-100">
                <img src={user.profilePhotoUrl} alt="User" className="w-8 h-8 rounded-full border-2 border-slate-200" />
                <span className="text-sm font-medium text-slate-700 hidden sm:inline">{user.firstName}</span>
                <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200/50 py-1.5 animate-fade-in-sm">
                  <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                  {menuItems.map(item => (
                    <a
                      key={item.label}
                      onClick={() => { navigate(item.view); setMenuOpen(false); }}
                      className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <item.icon className="w-4 h-4 mr-3 text-slate-500"/>
                      {item.label}
                    </a>
                  ))}
                  </div>
                  <div className="border-t border-slate-100 py-1">
                     <a onClick={onLogout} className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer">
                        <LogOutIcon className="w-4 h-4 mr-3 text-slate-500"/>
                        Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
