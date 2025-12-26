# WoundVision - Intelligent Wound Classification System

## Overview

WoundVision is a healthcare application that uses AI-powered image analysis to classify and assess wound conditions. The system allows healthcare professionals to upload wound images for automated clinical analysis, compare wounds over time to track healing progress, and receive detailed clinical recommendations based on standardized wound assessment criteria.

The application provides two primary workflows:
1. **Single Wound Analysis** - Upload and analyze individual wound images with comprehensive clinical assessments
2. **Temporal Comparison** - Compare before/after images to track healing progress and tissue changes

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management and data fetching

**UI Component System:**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom healthcare-focused design tokens
- Material Design influences for clinical credibility and information hierarchy
- Custom typography system using Inter for UI and Roboto Mono for clinical data
- Healthcare-specific color palette with trust-building neutral tones

**Design Rationale:**
The healthcare context demands professional, scannable layouts that prioritize data clarity. The design system draws from modern medical dashboards (Epic, Cerner) to establish clinical credibility while maintaining efficiency for healthcare professionals.

**State Management:**
- TanStack Query handles all server communication with automatic caching and refetching
- React hooks for local component state
- Toast notifications for user feedback on operations

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Node.js runtime environment
- RESTful API design pattern

**API Structure:**
Two primary endpoints handle the core functionality:
1. `POST /api/analyze-wound` - Accepts base64-encoded image, returns comprehensive wound analysis
2. `POST /api/compare-wounds` - Accepts two images, returns comparative healing assessment

**AI Integration:**
- OpenAI GPT-5 model for vision-based wound analysis
- Structured JSON responses ensure consistent clinical data format
- Expert-level system prompts guide medical-grade assessments across 10 clinical parameters

**Data Flow:**
1. Client uploads image as base64-encoded data
2. Server forwards to OpenAI with clinical assessment prompts
3. AI returns structured JSON with wound classifications
4. Server persists analysis to database
5. Client receives and displays formatted results

### Database Design

**Technology:**
- PostgreSQL (via Neon serverless) for relational data storage
- Drizzle ORM for type-safe database queries and migrations

**Schema Design:**

**wound_analyses table:**
Stores individual wound assessments with comprehensive clinical data:
- Image reference (base64 URL)
- Wound classification (type, tissue, exudate level)
- Border and depth characteristics
- Infection risk scoring (categorical + numeric)
- Healing stage assessment
- Clinical recommendations array
- Detailed narrative analysis

**comparison_reports table:**
Tracks temporal wound evolution:
- Before/after image references
- Complete analysis objects for both timepoints (JSONB)
- Quantified change metrics (size, tissue improvement, exudate, healing progress)
- Overall assessment narrative
- Evolution summary text

**Rationale:**
The schema separates individual analyses from comparisons to support both standalone assessments and temporal tracking. JSONB fields store complete analysis snapshots for flexible historical querying while maintaining structured metrics for trend analysis.

### Authentication & Authorization

**Current Implementation:**
No authentication system is currently implemented. The application operates as a single-user clinical tool.

**Future Considerations:**
Production deployment would require healthcare-appropriate authentication (likely session-based with secure cookie management via connect-pg-simple).

## External Dependencies

### AI Services
- **OpenAI API (GPT-5)** - Core vision analysis engine for wound classification
  - Provides medical-grade image analysis with structured clinical outputs
  - Handles complex wound assessment across 10+ clinical parameters

### Database Services
- **Neon Serverless PostgreSQL** - Cloud-hosted database provider
  - Serverless architecture for automatic scaling
  - PostgreSQL compatibility with full SQL feature set

### Frontend Libraries
- **Radix UI** - Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Chart.js** - Data visualization for healing progress metrics
- **react-dropzone** - File upload handling with drag-and-drop support
- **date-fns** - Date formatting and manipulation

### Development Tools
- **Drizzle Kit** - Database migration management
- **TypeScript** - Type safety across full stack
- **Vite plugins** - Development experience enhancements (error overlay, runtime debugging)

### Design System
- **Google Fonts** - Inter (UI text) and Roboto Mono (clinical data) typography
- **Tailwind CSS** - Utility-first styling framework with custom healthcare theme
- **lucide-react** - Consistent icon system