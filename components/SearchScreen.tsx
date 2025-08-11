
import React, { useEffect } from 'react';
import { SearchResultItem, ActivityCategory } from '../types';
import { 
    SearchIcon, FilterIcon, EyeIcon, SparklesIcon, ShoppingBagIcon, 
    UtensilsIcon, GlobeIcon, ArrowLeftIcon 
} from './IconComponents';
import { LoadingSpinner } from './LoadingSpinner';

interface SearchScreenProps {
    query: string;
    results: SearchResultItem[];
    isLoading: boolean;
    error: string | null;
    onSearch: (query: string) => void;
    onBack: () => void;
}

const categoryInfo: Record<ActivityCategory, { icon: React.ElementType, color: string }> = {
    'Attraction': { icon: EyeIcon, color: 'text-blue-500' },
    'Food & Dining': { icon: UtensilsIcon, color: 'text-orange-500' },
    'Shopping': { icon: ShoppingBagIcon, color: 'text-pink-500' },
    'Activity': { icon: SparklesIcon, color: 'text-teal-500' },
    'Hidden Gem': { icon: SparklesIcon, color: 'text-purple-500' },
    // Defaults for others
    'Transportation': { icon: GlobeIcon, color: 'text-slate-500' },
    'Accommodation': { icon: GlobeIcon, color: 'text-slate-500' },
    'Other': { icon: GlobeIcon, color: 'text-slate-500' },
};

const ResultCard: React.FC<{ item: SearchResultItem }> = ({ item }) => {
    const { icon: CategoryIcon, color } = categoryInfo[item.category] || categoryInfo['Other'];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300">
            <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <div className={`flex items-center text-sm font-semibold mb-2 ${color}`}>
                    <CategoryIcon className="w-4 h-4 mr-2" />
                    {item.category}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 flex-grow">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
            </div>
            <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex justify-end">
                <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
                    Add to Trip (soon)
                </button>
            </div>
        </div>
    );
};

export const SearchScreen: React.FC<SearchScreenProps> = ({ query, results, isLoading, error, onSearch, onBack }) => {

    useEffect(() => {
        if (query) {
            onSearch(query);
        }
    }, [query, onSearch]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="h-[60vh] flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-24 bg-red-50 rounded-2xl shadow-sm border border-red-200">
                    <h3 className="mt-4 text-lg font-semibold text-red-700">Search Failed</h3>
                    <p className="text-red-600 mt-1 max-w-md mx-auto">{error}</p>
                </div>
            );
        }
        
        if (results.length > 0) {
            return (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map(item => (
                        <ResultCard key={item.id} item={item} />
                    ))}
                </div>
            )
        }

        // Initial state or no results
        return (
             <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-slate-200">
                <SearchIcon className="w-20 h-20 mx-auto text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-700">No Results Found</h3>
                <p className="text-slate-500 mt-1">Try searching for a different destination.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex items-center">
                <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
                    <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                    Back to Dashboard
                </button>
            </div>

            <div>
                <p className="text-slate-500">Showing results for</p>
                <h1 className="text-3xl font-bold text-slate-800 capitalize">"{query}"</h1>
            </div>

            <div className="flex space-x-2">
                <div className="relative flex-grow">
                    <SearchIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"/>
                    <input 
                        type="text"
                        placeholder="Search again..."
                        defaultValue={query}
                        // In a real app, this would be a controlled component to allow new searches from this screen
                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
                    <FilterIcon className="w-4 h-4 mr-2"/>
                    Filter
                </button>
            </div>
            
            {renderContent()}
        </div>
    );
};