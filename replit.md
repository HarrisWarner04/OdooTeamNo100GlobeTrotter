# Globe Trotter - AI Travel Itinerary Generator

## Overview

Globe Trotter is a modern web application that generates personalized travel itineraries using AI. The application allows users to input their travel preferences (origin, destination, stops, duration, and notes) and generates detailed day-by-day travel plans using Google's Gemini AI. The system provides an intuitive interface with form-based input and beautifully formatted markdown itinerary outputs with emoji-categorized activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful endpoints with structured error handling and request logging
- **Validation**: Zod schemas for runtime type validation and data integrity
- **Development**: Hot module replacement and development middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Connection**: Neon Database serverless PostgreSQL for cloud-hosted database
- **Fallback Storage**: In-memory storage implementation for development and testing

### Authentication and Authorization
- **Current State**: Basic storage interface prepared for user management
- **User Schema**: Defined user table with username/password fields ready for implementation
- **Session Management**: Infrastructure prepared with connect-pg-simple for PostgreSQL session storage

### AI Integration
- **AI Provider**: Google Gemini AI (gemini-2.5-flash model) for intelligent itinerary generation
- **Prompt Engineering**: Structured system prompts with few-shot examples for consistent output formatting
- **Content Processing**: Markdown-based output with emoji categorization for travel activities
- **Error Handling**: Robust error management for AI service failures and API rate limits

## External Dependencies

### Third-Party Services
- **Google Gemini AI**: Core AI service for generating travel itineraries with natural language processing
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Replit Platform**: Development environment with integrated hosting and deployment

### Key Libraries and Frameworks
- **UI Framework**: React 18+ with TypeScript for modern component development
- **Component Library**: Radix UI primitives providing accessible, unstyled UI components
- **Database ORM**: Drizzle ORM for type-safe database queries and schema management
- **Validation**: Zod for runtime schema validation and type inference
- **HTTP Client**: Fetch API with custom wrapper for API communication
- **Date Handling**: date-fns for date manipulation and formatting
- **Development Tools**: ESBuild for fast compilation and Vite for development server

### Development and Build Tools
- **Package Manager**: npm with lockfile for dependency management
- **Build System**: Vite for frontend bundling and ESBuild for backend compilation
- **Development Server**: Express with Vite middleware for full-stack development
- **Code Quality**: TypeScript strict mode for type safety and error prevention
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer for cross-browser compatibility