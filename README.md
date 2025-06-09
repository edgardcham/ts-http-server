# TypeScript HTTP Server - Learning Project 🚀

## Overview

Welcome to **Chirpy** - a TypeScript-based HTTP server project designed for learning modern web development practices. This project demonstrates how to build a simple social media-style API service using TypeScript, Express.js, and best practices for error handling and middleware architecture.

## 🎯 What We're Building

Chirpy is a lightweight server that handles "chirps" (think tweets) with content validation and profanity filtering. It's a perfect starting point for understanding:

- TypeScript in a Node.js environment
- Express.js middleware patterns
- RESTful API design
- Error handling best practices
- Static file serving
- Server metrics tracking
- Database integration with Drizzle ORM
- PostgreSQL schema design and migrations

## 📚 Learning Goals

Through this project, you'll learn:

1. **TypeScript Fundamentals**
   - Type-safe Express handlers
   - Custom error classes
   - Strict mode configuration

2. **Express.js Patterns**
   - Middleware composition
   - Route handling
   - Static file serving
   - Error middleware

3. **API Design**
   - RESTful endpoints
   - Request validation
   - JSON responses
   - Status code management

4. **Development Workflow**
   - Build processes
   - Modern JavaScript (ES modules)
   - Project structure

5. **Database Development**
   - Drizzle ORM setup and configuration
   - PostgreSQL schema design
   - Type-safe database operations
   - Migration management

## 🏗️ Project Structure

```bash
ts-http-server/
├── src/                  # Source code
│   ├── app/             # Static web assets
│   │   ├── assets/      # Images and static resources
│   │   └── index.html   # Welcome page
│   ├── db/              # Database related files
│   │   ├── schema.ts    # Drizzle ORM schema definitions
│   │   └── migrations/  # Database migration files
│   ├── config.ts        # Application state management
│   ├── errors.ts        # Custom error classes
│   └── index.ts         # Main server entry point
├── dist/                # Compiled JavaScript (generated)
├── drizzle.config.ts    # Drizzle ORM configuration
├── package.json         # Project configuration
└── tsconfig.json        # TypeScript configuration
```

## 🔌 API Endpoints

### Public Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/healthz` | Health check | `200 OK` |
| POST | `/api/validate_chirp` | Validate and clean chirp content | `200` with cleaned content or `400` if invalid |

### Admin Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/admin/metrics` | View server metrics | HTML page with visit count |
| POST | `/admin/reset` | Reset metrics counter | `200 OK` |

### Static Files

| Path | Description |
|------|-------------|
| `/app/*` | Serves static files from `src/app/` directory |

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (for database functionality)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ts-http-server

# Install dependencies
npm install
```

### Development

```bash
# Build the TypeScript code
npm run build

# Run the server
npm start

# Or build and run in one command
npm run dev
```

The server will start on `http://localhost:8080`

### Database Setup

First, create a `.env` file in the project root:

```bash
# .env
DB_URL=postgres://postgres:password@localhost:5432/chirpy
```

Then run the database commands:

```bash
# Generate database migrations from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

## 💡 Key Features Explained

### 1. Content Validation

The `/api/validate_chirp` endpoint demonstrates input validation:

- Maximum 140 characters
- Profanity filtering (replaces inappropriate words with `****`)
- JSON request/response handling

**Example Request:**

```bash
curl -X POST http://localhost:8080/api/validate_chirp \
  -H "Content-Type: application/json" \
  -d '{"body": "Hello world! This is my first chirp!"}'
```

### 2. Custom Error Handling

The project implements a clean error handling pattern:

```typescript
// Custom error classes in errors.ts
class BadRequestError extends Error {
  statusCode = 400
}

// Centralized error handler in index.ts
app.use(errorHandler)
```

### 3. Middleware Architecture

Three key middleware functions demonstrate different patterns:

1. **`middlewareLogResponses`** - Logs non-successful responses
2. **`middlewareMetricsInc`** - Tracks page visits
3. **`errorHandler`** - Centralized error handling

### 4. Configuration Management

Enhanced configuration with environment variables in `config.ts`:

```typescript
import { loadEnvFile } from 'node:process';

loadEnvFile(); // Loads .env file

export const config: APIConfig = {
    fileServerHits: 0,
    dbUrl: envOrThrow('DB_URL'), // Ensures required env vars are set
};
```

Features:

- Automatic `.env` file loading using Node.js built-in `loadEnvFile()`
- Helper function `envOrThrow()` for required environment variables
- Type-safe configuration with `APIConfig` type

### 5. Database Schema

The project now includes a PostgreSQL database schema using Drizzle ORM:

```typescript
// src/db/schema.ts
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar('email', { length: 256 }).notNull().unique(),
});
```

Features:

- UUID primary keys for better distribution
- Automatic timestamp management
- Unique email constraints
- Type-safe insert operations with `NewUser` type

## 🔧 Configuration Files

### TypeScript Configuration (`tsconfig.json`)

- **Strict Mode**: Enabled for maximum type safety
- **Target**: ESNext for modern JavaScript features
- **Module**: ES2022 for ES modules support
- **Output**: Compiles to `dist/` directory

### Package Configuration (`package.json`)

- **Type**: Module (ES modules)
- **Scripts**:
  - `build`: Compile TypeScript
  - `start`: Run compiled server
  - `dev`: Build and run
  - `db:generate`: Generate migrations from schema changes
  - `db:migrate`: Apply migrations to database
- **Dependencies**: Express.js, Drizzle ORM, and PostgreSQL client

### Drizzle Configuration (`drizzle.config.ts`)

- **Dialect**: PostgreSQL
- **Schema**: Located at `./src/db/schema.ts`
- **Migrations**: Output to `./src/db/migrations`
- **Connection**: Uses `DB_URL` environment variable  
- **Environment**: Automatically loads `.env` file using Node.js `loadEnvFile()`

## 🎓 Learning Exercises

1. **Connect the database**: Create a database client and connect to PostgreSQL
2. **Implement user registration**: Create a `POST /api/users` endpoint using the users table
3. **Add chirps table**: Design and implement a chirps table with user relationships
4. **Persist chirps**: Update the validate endpoint to save chirps to the database
5. **Add authentication**: Implement JWT-based authentication for users
6. **Create API for chirps**: Build full CRUD operations for chirps
7. **Add more configuration**: Extend environment variables for JWT secrets, ports, etc.

## 🚀 Next Steps

With the database foundation in place, here's the development roadmap:

### Immediate Tasks

- ✅ Set up environment variables for database credentials
- Create database connection singleton
- Integrate database operations into existing endpoints
- Add chirps table to schema

### Future Enhancements

- **Real-time updates**: WebSocket integration for live chirps
- **File uploads**: Profile pictures and media attachments
- **Social features**: Following, likes, and retweets
- **Search functionality**: Full-text search for chirps
- **Rate limiting**: Redis-based rate limiting
- **Caching**: Implement caching layer for performance

## 📝 Development Notes

- The server uses in-memory storage for metrics (resets on restart)
- Profanity filter checks for: "kerfuffle", "sharbert", "fornax"
- All responses include appropriate HTTP status codes
- Error responses follow a consistent JSON format

## 🤝 Contributing

This is a learning project! Feel free to:

- Add new features
- Improve error handling
- Enhance the API
- Add tests
- Improve documentation

## 📄 License

This is an educational project for learning purposes.

---
