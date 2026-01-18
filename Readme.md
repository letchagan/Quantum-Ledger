# QuantumLedger

## Overview

QuantumLedger is a cyberpunk-themed cryptocurrency dashboard application that simulates a quantum-encrypted blockchain monitoring system. It displays real-time transactions, security logs, and system metrics with a futuristic neon-styled UI. The application is built as a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state with automatic refetching for real-time updates
- **Styling**: Tailwind CSS with a custom cyberpunk theme (cyan/purple/green neon colors)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for entry effects and transitions
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Framework**: Express 5 running on Node.js
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Data Seeding**: Automatic seed data on startup when database is empty

### Shared Code Structure
- `shared/schema.ts`: Drizzle table definitions and Zod schemas for type-safe API contracts
- `shared/routes.ts`: API route definitions with request/response schemas used by both frontend and backend

### Database Schema
Three main tables:
1. **transactions**: Blockchain transactions with hash, amount, currency, sender/receiver, status, and quantum signature
2. **security_logs**: Security events with severity levels (info, warning, critical, breach)
3. **system_metrics**: Node performance metrics including CPU, memory, network latency, and quantum entropy

### Key Design Patterns
- **Type-Safe API Contracts**: Shared Zod schemas ensure frontend and backend agree on data shapes
- **Polling for Real-Time Feel**: React Query refetches at intervals (2-5 seconds) to simulate live data
- **Component Composition**: CyberCard and StatWidget components provide consistent cyberpunk styling
- **Path Aliases**: `@/` maps to client/src, `@shared/` maps to shared directory

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations with `npm run db:push`

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for shadcn components
- **recharts**: Charting library for metrics visualization
- **framer-motion**: Animation library
- **date-fns**: Date formatting utilities
- **wouter**: Client-side routing

### Backend Libraries
- **express**: Web server framework
- **drizzle-orm**: Database ORM with PostgreSQL driver (pg)
- **zod**: Runtime type validation
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Backend bundler for production builds
- **tsx**: TypeScript execution for development
