import TravelForm from "@/components/travel-form";
import ItineraryDisplay from "@/components/itinerary-display";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Bot, Smartphone, Clock } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [generatedItinerary, setGeneratedItinerary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-600 rounded-lg flex items-center justify-center">
                <Globe className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Globe Trotter</h1>
                <p className="text-sm text-gray-500">AI Travel Itinerary Generator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TravelForm 
            onItineraryGenerated={setGeneratedItinerary}
            onGeneratingChange={setIsGenerating}
          />
          <ItineraryDisplay 
            itinerary={generatedItinerary}
            isGenerating={isGenerating}
            onRegenerate={() => setGeneratedItinerary(null)}
          />
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bot className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Planning</h3>
              <p className="text-gray-600 text-sm">Smart itineraries generated based on your preferences and travel style.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600 text-sm">Access your itinerary on any device, anywhere in the world.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="text-amber-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600 text-sm">Get your complete travel plan in seconds, not hours.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">&copy; 2024 Globe Trotter. Powered by AI for smarter travel planning.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
