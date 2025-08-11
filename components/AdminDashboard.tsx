
import React from 'react';
import { User, GeneratedItinerary } from '../types';
import { UsersIcon, MapIcon, LayoutDashboardIcon, GlobeIcon } from './IconComponents';

interface AdminDashboardProps {
    users: User[];
    trips: GeneratedItinerary[];
}

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, change?: string }> = ({ icon: Icon, title, value, change }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-100 rounded-lg">
                <Icon className="w-6 h-6 text-slate-600"/>
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
        {change && <p className="text-xs text-green-600 mt-2">{change}</p>}
    </div>
);

const BarChart: React.FC<{data: {label: string, value: number}[], title: string}> = ({data, title}) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
            <div className="space-y-3">
            {data.map(item => (
                <div key={item.label} className="flex items-center">
                    <span className="text-sm text-slate-600 w-28 truncate">{item.label}</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-4">
                        <div 
                            className="bg-teal-500 h-4 rounded-full text-white text-xs flex items-center justify-end pr-2"
                            style={{width: `${(item.value / maxValue) * 100}%`}}>
                                {item.value}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, trips }) => {
    const totalUsers = users.length;
    const totalTrips = trips.length;

    const popularDestinations = trips.reduce((acc, trip) => {
        const locations = trip.locations.split(',').map(l => l.trim());
        locations.forEach(loc => {
            acc[loc] = (acc[loc] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const top5Dests = Object.entries(popularDestinations)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }));

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="mt-1 text-slate-500">Platform usage analytics and user management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={UsersIcon} title="Total Users" value={totalUsers} />
                <StatCard icon={MapIcon} title="Total Trips Created" value={totalTrips} />
                <StatCard icon={GlobeIcon} title="Public Itineraries" value={trips.filter(t=>t.isPublic).length} />
                <StatCard icon={LayoutDashboardIcon} title="Active Users (mock)" value="12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <BarChart data={top5Dests} title="Top 5 Popular Destinations"/>
                </div>
                <div className="lg:col-span-3">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Manage Users</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Location</th>
                                        <th scope="col" className="px-6 py-3">Role</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap flex items-center">
                                                <img src={user.profilePhotoUrl} className="w-8 h-8 rounded-full mr-3" alt={user.firstName}/>
                                                {user.firstName} {user.lastName}
                                            </th>
                                            <td className="px-6 py-4">{user.city}, {user.country}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-800'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a href="#" className="font-medium text-teal-600 hover:underline">Edit</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
