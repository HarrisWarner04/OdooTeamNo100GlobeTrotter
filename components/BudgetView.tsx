
import React, { useMemo } from 'react';
import { GeneratedItinerary, ActivityCategory } from '../types';
import { WalletIcon, DollarSignIcon, UserIcon, BarChartIcon, CalendarIcon } from './IconComponents';

const categoryColors: Record<ActivityCategory, string> = {
  'Food & Dining': 'bg-blue-500',
  'Attraction': 'bg-teal-500',
  'Transportation': 'bg-orange-500',
  'Accommodation': 'bg-purple-500',
  'Shopping': 'bg-pink-500',
  'Other': 'bg-slate-400',
  'Activity': 'bg-indigo-500',
  'Hidden Gem': 'bg-yellow-500',
};

const categoryDisplayOrder: ActivityCategory[] = ['Accommodation', 'Transportation', 'Food & Dining', 'Attraction', 'Shopping', 'Activity', 'Hidden Gem', 'Other'];


interface KPIProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
}

const KPI_Card: React.FC<KPIProps> = ({ icon: Icon, label, value, subValue }) => (
  <div className="bg-slate-50/80 p-4 rounded-xl flex items-start space-x-4">
    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
      <Icon className="w-6 h-6 text-teal-600" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subValue && <p className="text-xs text-slate-400">{subValue}</p>}
    </div>
  </div>
);


export const BudgetView: React.FC<{ trip: GeneratedItinerary }> = ({ trip }) => {
  const { categoryCosts, maxCost, dailyCosts, totalCost, avgDailyCost } = useMemo(() => {
    const allActivities = trip.days.flatMap(day => day.activities);
    const totalTravelerCost = allActivities.reduce((sum, activity) => sum + (activity.cost * trip.num_travelers), 0);
    const totalCost = trip.est_total_cost;

    const costs: Record<string, number> = {};
    for (const activity of allActivities) {
      costs[activity.category] = (costs[activity.category] || 0) + (activity.cost * trip.num_travelers);
    }

    const dCosts = trip.days.map(day => {
      const dayTotal = day.activities.reduce((sum, act) => sum + (act.cost * trip.num_travelers), 0);
      return {
        date: day.date,
        cost: dayTotal,
        summary: day.day_summary
      };
    });

    const max = Math.max(...Object.values(costs), 1); // Avoid division by zero
    const avg = trip.days.length > 0 ? totalCost / trip.days.length : 0;

    return { categoryCosts: costs, maxCost: max, dailyCosts: dCosts, totalCost, avgDailyCost: avg };
  }, [trip]);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: trip.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPI_Card icon={WalletIcon} label="Total Estimated Cost" value={currencyFormatter.format(totalCost)} subValue={`for ${trip.num_travelers} traveler(s)`}/>
        <KPI_Card icon={DollarSignIcon} label="Average Cost / Day" value={currencyFormatter.format(avgDailyCost)} />
        <KPI_Card icon={UserIcon} label="Travelers" value={trip.num_travelers.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown by Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <BarChartIcon className="w-6 h-6 text-teal-600"/>
            <h3 className="text-lg font-bold text-slate-800">Cost by Category</h3>
          </div>
          <div className="space-y-4">
            {categoryDisplayOrder.map(category => {
              const cost = categoryCosts[category] || 0;
              if (cost === 0 && !Object.keys(categoryCosts).includes(category)) return null;
              
              const widthPercentage = (cost / maxCost) * 100;

              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-slate-600">{category}</span>
                    <span className="font-semibold text-slate-800">{currencyFormatter.format(cost)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className={`${categoryColors[category]} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Daily Cost Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center space-x-3 mb-4">
              <CalendarIcon className="w-6 h-6 text-teal-600"/>
              <h3 className="text-lg font-bold text-slate-800">Daily Cost Summary</h3>
          </div>
          <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {dailyCosts.map(({date, cost, summary}) => {
                const dayDate = new Date(date + 'T00:00:00');
                return (
                    <li key={date} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80">
                        <div>
                            <p className="font-semibold text-slate-700">{dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{summary}</p>
                        </div>
                        <p className="font-bold text-slate-800 text-lg">{currencyFormatter.format(cost)}</p>
                    </li>
                )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
