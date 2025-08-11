import { GoogleGenAI } from "@google/genai";
import type { TravelRequest } from "@shared/schema";

// the newest Gemini model is "gemini-2.5-flash" which was released after knowledge cutoff. do not change this unless explicitly requested by the user
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

const GLOBE_TROTTER_SYSTEM_PROMPT = `You are 'Globe Trotter', a friendly and expert AI travel agent. Your job is to create a simple, exciting, and well-structured day-by-day travel itinerary based on user input.

RULES:

Always use Markdown for formatting.

Start with a trip title and a one-sentence "Vibe Check" that summarizes the trip's feel.

For each day, create a clear heading (e.g., "### Day 1: Title").

Use emojis for key categories: ✈️ (Travel), 🏨 (Lodging), 😋 (Food), 🏛️ (Activities).

Suggest 1-2 key activities per day. Keep descriptions short, fun, and engaging.

The output must be easy to read and visually attractive.`;

const EXAMPLE_FORMAT = `Your Trip: Hackathon & Blessings
Vibe Check: A spiritual and focused journey that balances a sacred temple visit with intense coding and much-needed rest.

### Day 1: Spiritual Beginnings

✈️ Travel: Take an early morning train from Bhopal to Ujjain.

🏛️ Activity: Visit the Mahakaleshwar Temple for blessings in the afternoon.

✈️ Travel: Board an overnight train from Ujjain to Ahmedabad to maximize rest.

### Day 2: Recharge & Prepare

🏨 Lodging: Arrive in Ahmedabad and travel to your pre-booked hotel in Gandhinagar.

😋 Activity: Rest up for the hackathon. We suggest ordering in from a top-rated local restaurant.

### Day 3: Hackathon Day 1

🏛️ Activity: Time to shine at the Odoo Hackathon 2025! We've pinned a nearby 24/7 coffee shop for you. Good luck!

### Day 4: Victory & Recovery

🏛️ Activity: Complete the final stretch of the hackathon.

🏨 Lodging: Your room is booked for tonight. Get some well-deserved sleep!

### Day 5: Homeward Bound

😋 Food: Enjoy a final Gujarati breakfast.

✈️ Travel: Take a comfortable afternoon train from Ahmedabad back to Bhopal.`;

export async function generateItinerary(travelRequest: TravelRequest): Promise<string> {
  try {
    const { origin, destination, stops, duration, notes } = travelRequest;
    
    // Format the user input according to the Globe Trotter template
    const userInput = `Origin: ${origin}

Destination: ${destination}

${stops ? `Stops: ${stops}` : 'Stops: None'}

Duration: ${duration}

${notes ? `Notes: ${notes}` : 'Notes: None'}`;

    const fullPrompt = `${GLOBE_TROTTER_SYSTEM_PROMPT}

Here's an example of the perfect format:

${EXAMPLE_FORMAT}

Now create an itinerary for this request:

${userInput}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: fullPrompt }]
      }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 2048,
      }
    });

    const generatedText = response.text;
    
    if (!generatedText) {
      throw new Error("No response generated from AI service");
    }

    // Clean up the response to ensure proper formatting
    return generatedText.trim();

  } catch (error) {
    console.error("Error generating itinerary with Gemini:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage?.includes("API key")) {
      throw new Error("AI service configuration error. Please check API key setup.");
    }
    
    if (errorMessage?.includes("quota") || errorMessage?.includes("limit")) {
      throw new Error("AI service temporarily unavailable due to usage limits. Please try again later.");
    }
    
    if (errorMessage?.includes("blocked") || errorMessage?.includes("safety")) {
      throw new Error("Unable to generate itinerary for this request. Please try modifying your travel details.");
    }
    
    throw new Error("Failed to generate travel itinerary. Please try again with different details.");
  }
}
