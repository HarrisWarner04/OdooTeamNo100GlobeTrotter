import React, { useState, useMemo } from 'react';
import { GeneratedItinerary, Activity } from '../types';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from './IconComponents';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC<{ trip: GeneratedItinerary }> = ({ trip }) => {
  const [currentDate, setCurrentDate] = useState(new Date(trip.start_date + 'T00:00:00'));

  const tripActivitiesByDate = useMemo(() => {
    const map = new Map<string, Activity[]>();
    trip.days.forEach(day => {
      map.set(day.date, day.activities);
    });
    return map;
  }, [trip]);

  const { monthGrid, monthName, year } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid: (Date | null)[] = [];
    
    // Add padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null);
    }
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day));
    }

    return {
      monthGrid: grid,
      monthName: currentDate.toLocaleDateString('en-US', { month: 'long' }),
      year: year,
    };
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const tripStartDate = new Date(trip.start_date + 'T00:00:00').getTime();
  const tripEndDate = new Date(trip.end_date + 'T00:00:00').getTime();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">{monthName} {year}</h3>
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-500 py-2 bg-slate-50">
            {day}
          </div>
        ))}

        {monthGrid.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="bg-slate-50"></div>;
          }

          const dateString = date.toISOString().split('T')[0];
          const activities = tripActivitiesByDate.get(dateString);
          const isTripDay = date.getTime() >= tripStartDate && date.getTime() <= tripEndDate;
          const today = new Date();
          const isToday = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();

          return (
            <div key={date.toString()} className={`relative p-2 h-36 bg-white overflow-y-auto ${isTripDay ? 'bg-teal-50/50' : ''}`}>
              <time
                dateTime={dateString}
                className={`flex items-center justify-center h-6 w-6 rounded-full text-sm font-semibold
                  ${isToday ? 'bg-teal-600 text-white' : isTripDay ? 'text-teal-700' : 'text-slate-500'}`}
              >
                {date.getDate()}
              </time>
              
              {activities && (
                <ul className="mt-1 space-y-1">
                    {activities.slice(0, 3).map(activity => (
                        <li key={activity.id} className="flex items-start text-xs text-slate-700 bg-white p-1 rounded border border-slate-200">
                            <ClockIcon className="w-3 h-3 text-slate-400 mr-1.5 mt-0.5 shrink-0"/>
                            <span className="truncate">{activity.title}</span>
                        </li>
                    ))}
                    {activities.length > 3 && <li className="text-xs text-slate-500 text-center">+ {activities.length - 3} more</li>}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
