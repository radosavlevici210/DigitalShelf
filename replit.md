# CryptoMiner Pro - Professional Mining Dashboard

## Overview

This is a professional cryptocurrency mining dashboard application built with a modern full-stack architecture. The application provides real-time monitoring of mining operations, hardware status, wallet transactions, and pool management capabilities. It features a dark-themed mining-focused UI with comprehensive analytics and control panels.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with dark theme optimization
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Real-time Updates**: WebSocket integration for live data

### Backend Architecture
- **Runtime**: Node.js with TypeScript (ES Modules)
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Real-time**: WebSocket server for live mining updates
- **Session Management**: Connect-PG-Simple for PostgreSQL sessions

### Build System
- **Bundler**: Vite for frontend development and building
- **TypeScript**: Strict compilation with path mapping
- **Build Process**: Separate client (Vite) and server (esbuild) builds
- **Development**: Hot module replacement and runtime error overlay

## Key Components

### Database Schema
The application uses a comprehensive PostgreSQL schema with the following main tables:
- **users**: User authentication and wallet addresses
- **mining_pools**: Pool configurations with latency and fee tracking
- **mining_stats**: Hashrate, shares, and earnings data
- **hardware_monitoring**: GPU temperature, power, and performance metrics
- **mining_configurations**: User-specific mining settings
- **wallet_transactions**: Financial transaction history

### API Structure
RESTful API endpoints organized by domain:
- `/api/mining/*` - Mining statistics and operations
- `/api/hardware/*` - Hardware monitoring data
- `/api/wallet/*` - Wallet and transaction management
- `/api/pools/*` - Mining pool management
- WebSocket endpoint at `/ws` for real-time updates

### Real-time Features
- Live hashrate monitoring
- Hardware temperature and performance tracking
- Mining pool status updates
- Automatic reconnection for WebSocket connections
- Broadcasting system for multi-client updates

## Data Flow

1. **Frontend Components** request data via TanStack Query hooks
2. **API Routes** handle requests and interact with the database through Drizzle ORM
3. **WebSocket Server** broadcasts real-time updates to connected clients
4. **Database** stores mining statistics, hardware data, and user configurations
5. **Real-time Updates** trigger UI refreshes through query invalidation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **ws**: WebSocket implementation
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Headless UI components (30+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Frontend build tool
- **tsx**: TypeScript execution for development
- **esbuild**: Fast server bundling

## Deployment Strategy

### Replit Deployment
- **Platform**: Replit with autoscale deployment target
- **Build Command**: `npm run build` (builds both client and server)
- **Start Command**: `npm run start` (production server)
- **Port Configuration**: Internal port 5000, external port 80

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment setting (development/production)

### Build Process
1. Vite builds the React frontend to `dist/public`
2. esbuild bundles the Express server to `dist/index.js`
3. Static files are served from the `dist/public` directory
4. Database migrations can be applied with `npm run db:push`

## Changelog

- June 18, 2025: Initial setup
- June 18, 2025: Completed migration from Replit Agent to standard Replit environment
  - Set up PostgreSQL database with all required tables
  - Fixed routing issues and verified dashboard functionality
  - Confirmed real-time WebSocket connections and data flow
  - Application fully operational with mining wallet: 0xe246E8773056bc770A4949811AE9223Bcf3c1A3A

## User Preferences

Preferred communication style: Simple, everyday language.