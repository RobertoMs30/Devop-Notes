# Overview

This is a full-stack notes management application built with React and TypeScript. The application allows users to create, edit, delete, and search notes with a clean, modern interface. It features both local storage capabilities for the frontend and a REST API backend with database support through Drizzle ORM and PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Custom hooks with React Query for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and optimized builds

## Backend Architecture
- **Server**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured error handling
- **Storage**: Dual storage approach - in-memory storage for development and PostgreSQL for production
- **Validation**: Zod schemas for request/response validation

## Data Storage Solutions
- **Development**: In-memory storage using Maps for rapid prototyping
- **Production**: PostgreSQL database with Drizzle ORM
- **Client-side**: localStorage for offline capabilities and improved UX
- **Schema**: Shared TypeScript schemas between frontend and backend

## Authentication and Authorization
- Basic user schema implemented but not actively used in current note management flow
- Prepared for future authentication implementation with user-note relationships

## Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared schemas
- **Component Composition**: Modular UI components with proper separation
- **Custom Hooks**: Reusable logic for notes management and UI state
- **Error Boundaries**: Structured error handling throughout the application

# External Dependencies

## Core Framework Dependencies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety across the entire application
- **Express.js**: Web server framework for the backend API

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Headless UI primitives for accessibility
- **Shadcn/ui**: Pre-built component library on top of Radix
- **Lucide React**: Icon library for consistent iconography

## Data and State Management
- **@tanstack/react-query**: Server state management and caching
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Schema validation for TypeScript
- **@neondatabase/serverless**: PostgreSQL serverless driver

## Development Tools
- **Vite**: Build tool and development server
- **ESLint**: Code linting with TypeScript support
- **Jest**: Testing framework with React Testing Library
- **Wouter**: Lightweight routing library

## Specialized Libraries
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Utility for component variant styling
- **clsx**: Conditional className utility
- **cmdk**: Command palette component