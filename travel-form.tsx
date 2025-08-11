import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Flag, Route, Calendar, StickyNote, Wand2, Loader2 } from "lucide-react";
import { travelRequestSchema, type TravelRequest } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TravelFormProps {
  onItineraryGenerated: (itinerary: string) => void;
  onGeneratingChange: (isGenerating: boolean) => void;
}

export default function TravelForm({ onItineraryGenerated, onGeneratingChange }: TravelFormProps) {
  const { toast } = useToast();
  
  const form = useForm<TravelRequest>({
    resolver: zodResolver(travelRequestSchema),
    defaultValues: {
      origin: "",
      destination: "",
      stops: "",
      duration: "",
      notes: "",
    },
  });

  const generateItineraryMutation = useMutation({
    mutationFn: async (data: TravelRequest) => {
      const response = await apiRequest("POST", "/api/generate-itinerary", data);
      return response.json();
    },
    onMutate: () => {
      onGeneratingChange(true);
    },
    onSuccess: (data) => {
      if (data.success) {
        onItineraryGenerated(data.content);
        toast({
          title: "Itinerary Generated!",
          description: "Your personalized travel plan is ready.",
        });
      } else {
        throw new Error(data.message || "Failed to generate itinerary");
      }
    },
    onError: (error: any) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate itinerary. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      onGeneratingChange(false);
    },
  });

  const onSubmit = (data: TravelRequest) => {
    generateItineraryMutation.mutate(data);
  };

  const isGenerating = generateItineraryMutation.isPending;

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Plan Your Journey</h2>
          <p className="text-gray-600">Tell us about your travel plans and we'll create a personalized itinerary for you.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 text-primary mr-2" />
                      From
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter departure city"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Flag className="w-4 h-4 text-green-600 mr-2" />
                      To
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter destination city"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Route className="w-4 h-4 text-amber-600 mr-2" />
                      Stops (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Cities to visit along the way"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 text-primary mr-2" />
                      Duration
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1 Day">1 Day</SelectItem>
                        <SelectItem value="2 Days">2 Days</SelectItem>
                        <SelectItem value="3 Days">3 Days</SelectItem>
                        <SelectItem value="5 Days">5 Days</SelectItem>
                        <SelectItem value="1 Week">1 Week</SelectItem>
                        <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <StickyNote className="w-4 h-4 text-green-600 mr-2" />
                    Special Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4}
                      placeholder="Any special requirements, events, preferences, or constraints..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isGenerating}
              className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate My Itinerary
                </>
              )}
            </Button>
          </form>
        </Form>

        {isGenerating && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-blue-700 font-medium">Globe Trotter is crafting your perfect itinerary...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
