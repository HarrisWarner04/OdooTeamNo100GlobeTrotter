

import { GoogleGenAI, Type } from "@google/genai";
import type { TripPreferences, GeneratedItinerary, SearchResultItem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itineraryResponseSchema = {
    type: Type.OBJECT,
    properties: {
        trip_name: { 
            type: Type.STRING, 
            description: "A creative and fitting name for the trip. This should reflect the user's stated trip name if provided, but can be enhanced." 
        },
        est_total_cost: { 
            type: Type.NUMBER, 
            description: "Estimated total cost for the trip for all travelers, in the specified currency." 
        },
        currency: { 
            type: Type.STRING, 
            enum: ["USD", "EUR", "INR"],
            description: "The currency for all monetary values."
        },
        days: {
            type: Type.ARRAY,
            description: "An array of daily plans.",
            items: {
                type: Type.OBJECT,
                properties: {
                    date: { 
                        type: Type.STRING, 
                        description: "The date for this day's plan in YYYY-MM-DD format." 
                    },
                    day_summary: { 
                        type: Type.STRING, 
                        description: "A one-sentence summary of the day's theme or key activities." 
                    },
                    activities: {
                        type: Type.ARRAY,
                        description: "A list of activities for the day.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING, description: "The name of the activity." },
                                start_time: { type: Type.STRING, description: "Suggested start time in HH:MM format." },
                                end_time: { type: Type.STRING, description: "Suggested end time in HH:MM format." },
                                duration_minutes: { type: Type.INTEGER, description: "Estimated duration in minutes." },
                                cost: { type: Type.NUMBER, description: "Estimated cost per person for this activity." },
                                currency: { type: Type.STRING, enum: ["USD", "EUR", "INR"] },
                                location: { type: Type.STRING, description: "The specific location or area for the activity." },
                                notes: { type: Type.STRING, description: "Brief, helpful notes or tips about the activity." },
                                confidence: { 
                                    type: Type.STRING, 
                                    enum: ["low", "medium", "high"],
                                    description: "Confidence level in the suggestion's quality and feasibility."
                                },
                                category: {
                                    type: Type.STRING,
                                    enum: ['Food & Dining', 'Attraction', 'Transportation', 'Accommodation', 'Shopping', 'Other', 'Activity', 'Hidden Gem'],
                                    description: "The category of the activity."
                                }
                            },
                            required: ["title", "start_time", "end_time", "duration_minutes", "cost", "currency", "location", "notes", "confidence", "category"]
                        }
                    }
                },
                required: ["date", "day_summary", "activities"]
            }
        }
    },
    required: ["trip_name", "est_total_cost", "currency", "days"]
};

const buildItineraryPrompt = (preferences: TripPreferences): string => {
  return `
    You are GlobeTrotter's Trip Concierge. Your task is to create a detailed travel itinerary based on user preferences.
    Produce a JSON object that strictly follows the provided schema. Do not include any extra text or markdown formatting.
    Ensure the dates in the response fall exactly between the start and end dates provided.
    The plan should be practical, logical, and reflect the specified pace and interests.
    Keep the plan concise and useful.

    User Preferences:
    - Trip Name: ${preferences.trip_name}
    - Trip Duration: ${preferences.start_date} to ${preferences.end_date}
    - Destination(s): ${preferences.locations}
    - Key Interests: ${preferences.interests}
    - Travel Pace: ${preferences.pace}
    - Budget per Person: ${preferences.budget_per_person} USD
    - Number of Travelers: ${preferences.num_travelers}
    - Must-Visit Places: ${preferences.must_visits}

    Return JSON only.
  `;
};

export const generateItinerary = async (preferences: TripPreferences): Promise<GeneratedItinerary> => {
    const prompt = buildItineraryPrompt(preferences);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: itineraryResponseSchema,
                temperature: 0.3
            }
        });

        const jsonText = response.text.trim();
        let parsedJson = JSON.parse(jsonText);

        if (!parsedJson.trip_name || !parsedJson.days || !Array.isArray(parsedJson.days)) {
            throw new Error("AI returned incomplete data. The response is missing required fields.");
        }
        
        parsedJson.days = parsedJson.days.map((day: any, dayIndex: number) => ({
            ...day,
            id: `day-${Date.now()}-${dayIndex}`,
            activities: day.activities.map((activity: any, activityIndex: number) => ({
                ...activity,
                id: `activity-${Date.now()}-${dayIndex}-${activityIndex}`
            }))
        }));

        return { ...preferences, ...parsedJson };

    } catch (error) {
        console.error("Error generating itinerary from Gemini API:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The request was blocked due to safety settings. Please adjust your input.");
        }
        throw new Error("Failed to generate itinerary. The AI service may be temporarily unavailable or the input is invalid.");
    }
};

// --- New Search Functionality ---

const searchActivitiesSchema = {
    type: Type.OBJECT,
    properties: {
        results: {
            type: Type.ARRAY,
            description: "A list of activites, points of interest, or restaurants.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The name of the place or activity." },
                    description: { type: Type.STRING, description: "A short, compelling description (20-30 words)." },
                    category: {
                        type: Type.STRING,
                        enum: ['Attraction', 'Food & Dining', 'Shopping', 'Activity', 'Hidden Gem'],
                        description: "The category of the result."
                    }
                },
                required: ["title", "description", "category"]
            }
        }
    },
    required: ["results"]
};

const buildSearchPrompt = (query: string): string => {
    return `
      You are a travel discovery assistant. Your goal is to find popular and interesting activities, points of interest, and restaurants for a given location.
      Return a JSON object containing a 'results' array with up to 12 items that strictly follows the provided schema.
      Do not include any extra text or markdown formatting.

      Search Query:
      - Location: "${query}"

      Return JSON only.
    `;
};

export const searchActivities = async (query: string): Promise<Omit<SearchResultItem, 'id' | 'imageUrl'>[]> => {
    const prompt = buildSearchPrompt(query);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: searchActivitiesSchema,
                temperature: 0.5
            }
        });
        
        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (!parsedJson.results || !Array.isArray(parsedJson.results)) {
            throw new Error("AI returned malformed search data.");
        }

        return parsedJson.results;

    } catch(error) {
        console.error("Error searching for activities from Gemini API:", error);
        if (error instanceof Error && error.message.includes('SAFETY')) {
            throw new Error("The search request was blocked due to safety settings. Please adjust your query.");
        }
        throw new Error("Failed to get search results. The AI service may be temporarily unavailable.");
    }
};