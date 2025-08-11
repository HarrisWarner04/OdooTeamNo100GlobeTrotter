import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateItinerary } from "./services/gemini";
import { travelRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate travel itinerary
  app.post("/api/generate-itinerary", async (req, res) => {
    try {
      const validatedData = travelRequestSchema.parse(req.body);
      
      const itineraryContent = await generateItinerary(validatedData);
      
      // Save to storage
      const savedItinerary = await storage.createItinerary({
        ...validatedData,
        generatedContent: itineraryContent,
      });
      
      res.json({
        id: savedItinerary.id,
        content: itineraryContent,
        success: true,
      });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid input data",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to generate itinerary. Please try again.",
        });
      }
    }
  });

  // Get saved itinerary
  app.get("/api/itinerary/:id", async (req, res) => {
    try {
      const itinerary = await storage.getItinerary(req.params.id);
      if (!itinerary) {
        res.status(404).json({
          success: false,
          message: "Itinerary not found",
        });
        return;
      }
      
      res.json({
        success: true,
        itinerary,
      });
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch itinerary",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
