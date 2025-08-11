
import React, { useState, useCallback } from 'react';
import { TripPreferences, GeneratedItinerary, User, SearchResultItem } from './types';
import { generateItinerary, searchActivities } from './services/geminiService';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { Dashboard } from './components/Dashboard';
import { CreateTripScreen } from './components/CreateTripScreen';
import { TripDetail } from './components/TripDetail';
import { PlannerScreen } from './components/PlannerScreen';
import { MyTripsScreen } from './components/MyTripsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { PublicTripView } from './components/PublicTripView';
import { AdminDashboard } from './components/AdminDashboard';
import { SearchScreen } from './components/SearchScreen';
import { MOCK_USER, MOCK_TRIPS, MOCK_COMMUNITY_TRIPS, MOCK_USERS_LIST } from './services/mockApi';

export type View = 
  | 'login' | 'register' | 'dashboard' | 'myTrips' | 'createTrip' 
  | 'planner' | 'tripDetail' | 'publicTripView' | 'profile' | 'settings' 
  | 'community' | 'admin' | 'search';

type CreationData = { tripName: string; startDate: string; endDate: string; description: string; coverPhotoUrl: string; locations: string; };

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('login');
  
  const [trips, setTrips] = useState<GeneratedItinerary[]>([]);
  const [communityTrips, setCommunityTrips] = useState<GeneratedItinerary[]>(MOCK_COMMUNITY_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState<GeneratedItinerary | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [creationData, setCreationData] = useState<CreationData | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = (view: View) => {
    window.scrollTo(0, 0);
    setCurrentView(view);
  };

  const handleLogin = (email: string, pass: string) => {
    console.log('Login attempt:', { email });
    setUser(MOCK_USER);
    setTrips(MOCK_TRIPS);
    navigate('dashboard');
  };

  const handleRegister = (details: Omit<User, 'id' | 'role'>) => {
    console.log('Registering user:', details);
    const newUser = { ...MOCK_USER, ...details, id: Date.now().toString() };
    setUser(newUser);
    setTrips([]); // New user has no trips
    navigate('dashboard');
  }

  const handleLogout = () => {
    setUser(null);
    setTrips([]);
    setSelectedTrip(null);
    setItinerary(null);
    navigate('login');
  };
  
  const handleGenerateItinerary = useCallback(async (preferences: TripPreferences) => {
    if(!user) return;
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const result = await generateItinerary(preferences);
      const newItinerary: GeneratedItinerary = {
        ...result,
        id: Date.now().toString(),
        ...preferences,
        status: 'upcoming',
        isPublic: false,
        author: { id: user.id, name: `${user.firstName} ${user.lastName}`, profilePhotoUrl: user.profilePhotoUrl },
        likes: 0,
        shares: 0,
      };
      setItinerary(newItinerary);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  const handleSaveTrip = (tripToSave: GeneratedItinerary) => {
    setTrips(prev => [tripToSave, ...prev]);
    setItinerary(null);
    navigate('myTrips');
  };
  
  const handleUpdateTrip = (updatedTrip: GeneratedItinerary) => {
    setTrips(prev => prev.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
    setSelectedTrip(updatedTrip);
  };
  
  const handleDeleteTrip = (tripId: string) => {
      setTrips(prev => prev.filter(t => t.id !== tripId));
      navigate('myTrips');
      setSelectedTrip(null);
  };
  
  const handleViewTrip = (trip: GeneratedItinerary) => {
      setSelectedTrip(trip);
      navigate('tripDetail');
  };

  const handleViewPublicTrip = (trip: GeneratedItinerary) => {
      setSelectedTrip(trip);
      navigate('publicTripView');
  };

  const handleContinueToPlanner = (data: CreationData) => {
    setCreationData(data);
    setItinerary(null);
    setError(null);
    navigate('planner');
  };

  const handleNavigateSearch = (query: string) => {
      setSearchQuery(query);
      setError(null);
      setSearchResults([]);
      navigate('search');
  };
  
  const handlePerformSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchActivities(query);
      const resultsWithIdsAndImages: SearchResultItem[] = results.map((item, index) => ({
        ...item,
        id: `search-${Date.now()}-${index}`,
        imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(item.title)}`
      }));
      setSearchResults(resultsWithIdsAndImages);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown search error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);


  if (!user) {
    if (currentView === 'register') {
      return <RegisterScreen onRegister={handleRegister} onNavigateLogin={() => navigate('login')} />;
    }
    return <LoginScreen onLogin={handleLogin} onNavigateRegister={() => navigate('register')} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userName={user.firstName} onPlanNewTrip={() => navigate('createTrip')} onViewMyTrips={() => navigate('myTrips')} recentTrips={trips.slice(0,2)} onSearch={handleNavigateSearch} />;
      case 'myTrips':
        return <MyTripsScreen trips={trips} onViewTrip={handleViewTrip} />;
      case 'createTrip':
        return <CreateTripScreen onContinue={handleContinueToPlanner} onBack={() => navigate('dashboard')} />;
      case 'planner':
        return <PlannerScreen onGenerate={handleGenerateItinerary} itinerary={itinerary} isLoading={isLoading} error={error} onSave={handleSaveTrip} onDiscard={() => setItinerary(null)} creationData={creationData} />;
      case 'tripDetail':
        return selectedTrip && <TripDetail trip={selectedTrip} onBack={() => navigate('myTrips')} onUpdateTrip={handleUpdateTrip} onDeleteTrip={() => handleDeleteTrip(selectedTrip.id)} onEditWithAI={() => { setSelectedTrip(selectedTrip); navigate('planner');}}/>;
      case 'profile':
        return <ProfileScreen user={user} trips={trips} onNavigateToSettings={() => navigate('settings')} onViewTrip={handleViewTrip} />;
      case 'settings':
        return <SettingsScreen user={user} onUpdateUser={(updatedUser) => setUser(updatedUser)} onBack={() => navigate('profile')} />;
      case 'community':
        return <CommunityScreen trips={communityTrips} onViewTrip={handleViewPublicTrip} />;
      case 'publicTripView':
        return selectedTrip && <PublicTripView trip={selectedTrip} onBack={() => navigate('community')} onCopyToMyTrips={(trip) => { handleSaveTrip({...trip, id: Date.now().toString() }); navigate('myTrips'); }} />;
      case 'admin':
        return <AdminDashboard users={MOCK_USERS_LIST} trips={MOCK_TRIPS.concat(MOCK_COMMUNITY_TRIPS)} />;
      case 'search':
        return <SearchScreen query={searchQuery} results={searchResults} onSearch={handlePerformSearch} isLoading={isLoading} error={error} onBack={() => navigate('dashboard')} />;
      default:
        navigate('dashboard');
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Header user={user} onLogout={handleLogout} navigate={navigate} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
       <footer className="text-center p-4 text-sm text-slate-400 border-t border-slate-200 mt-8">
        Soulful Heron - GlobalTrotter AI
      </footer>
    </div>
  );
};

export default App;
