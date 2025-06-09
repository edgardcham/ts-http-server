# TypeScript HTTP Server - Learning Project 🚀

## Overview

Welcome to **Chirpy** - a TypeScript-based HTTP server project designed for learning modern web development practices. This project demonstrates how to build a simple social media-style API service using TypeScript, Express.js, and best practices for error handling and middleware architecture.

## 🎯 What We're Building

Chirpy is a full-featured social media API that handles user registration and "chirps" (think tweets) with content validation and profanity filtering. The project now includes complete database integration and demonstrates:

- TypeScript in a Node.js environment
- Express.js middleware patterns
- RESTful API design with proper resource naming
- Error handling best practices
- Static file serving
- Server metrics tracking
- Database integration with Drizzle ORM
- PostgreSQL schema design and migrations
- Automatic database migrations
- Type-safe database operations

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
   - RESTful endpoints (note: using pluralized nouns even for single resources)
   - Request validation
   - JSON responses
   - Status code management
   - Data transformation (database snake_case to API camelCase)

4. **Development Workflow**
   - Build processes
   - Modern JavaScript (ES modules)
   - Project structure

5. **Database Development**
   - Drizzle ORM setup and configuration
   - PostgreSQL schema design
   - Type-safe database operations
   - Migration management
   - Automatic database migrations on server startup
   - Foreign key relationships and constraints

## 🏗️ Project Structure

```bash
ts-http-server/
├── src/                  # Source code
│   ├── api/             # API handlers and middleware
│   │   ├── chirps.ts    # Chirp creation endpoint
│   │   ├── users.ts     # User management endpoint
│   │   ├── errorHandler.ts # Centralized error handling
│   │   ├── errors.ts    # Custom error classes
│   │   ├── metrics.ts   # Admin metrics handlers
│   │   ├── middlewares.ts # Request logging and metrics
│   │   └── readiness.ts # Health check endpoint
│   ├── app/             # Static web assets
│   │   ├── assets/      # Images and static resources
│   │   └── index.html   # Welcome page
│   ├── db/              # Database layer
│   │   ├── schema.ts    # Drizzle ORM schema definitions
│   │   ├── index.ts     # Database connection
│   │   ├── migrations/  # Auto-generated migration files
│   │   └── queries/     # Database query functions
│   │       ├── users.ts
│   │       ├── chirps.ts
│   │       └── admin.ts
│   ├── config.ts        # Enhanced configuration with env vars
│   └── index.ts         # Main server entry point
├── dist/                # Compiled JavaScript (generated)
├── drizzle.config.ts    # Drizzle ORM configuration
├── package.json         # Project configuration
└── tsconfig.json        # TypeScript configuration
```

## 🔌 API Endpoints

> **RESTful Convention**: All endpoints use **pluralized nouns** (e.g., `/users`, `/chirps`) even when operating on a single resource. This follows REST best practices for consistent URL structure.

### Public Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/healthz` | Health check endpoint | None | `200 OK` |
| POST | `/api/users` | Create a new user account | `{"email": "user@example.com", "password": "securePass123"}` | `201` with user object (password excluded) |
| POST | `/api/login` | Authenticate user login | `{"email": "user@example.com", "password": "securePass123"}` | `200` with user object or `401` if invalid |
| POST | `/api/chirps` | Create a new chirp | `{"body": "Hello world!", "userId": "uuid"}` | `201` with chirp object |
| GET | `/api/chirps` | Get all chirps (ordered by creation date) | None | `200` with array of chirp objects |
| GET | `/api/chirps/:chirpId` | Get a specific chirp by ID | None | `200` with chirp object or `404` if not found |

### Admin Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/admin/metrics` | View server visit metrics | HTML page with visit count |
| POST | `/admin/reset` | Reset metrics counter & delete all users | `200 OK` |

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

First, create a `.env` file in the project root with all required environment variables:

```bash
# .env
DB_URL=postgres://postgres:password@localhost:5432/chirpy
PORT=8080
PLATFORM=dev
```

Then run the database commands:

```bash
# Generate database migrations from schema
npm run db:generate

# Apply migrations to database (optional - migrations run automatically on server start)
npm run db:migrate
```

**Note**: Database migrations now run **automatically** when the server starts, so manual migration is optional for development.

## 💡 Key Features Explained

### 1. User Authentication & Management

**User Registration** with secure password hashing:

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123"}'
```

**User Login** with credential verification:

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123"}'
```

**Security Features:**
- Passwords hashed with bcrypt (10 salt rounds)
- Hashed passwords never returned in API responses
- Email uniqueness enforced at database level
- Secure password comparison for login verification

### 2. Chirp Creation with Content Validation

The `/api/chirps` endpoint demonstrates comprehensive input validation:

- Maximum 140 characters
- Profanity filtering (replaces inappropriate words with `****`)
- User ID validation (must exist in database)
- JSON request/response handling

**Example Requests:**

```bash
# Create a chirp
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -d '{"body": "Hello world! This is my first chirp!", "userId": "user-uuid-here"}'

# Get all chirps (ordered by creation date)
curl http://localhost:8080/api/chirps

# Get a specific chirp by ID
curl http://localhost:8080/api/chirps/chirp-uuid-here
```

### 3. Custom Error Handling

The project implements a clean error handling pattern:

```typescript
// Custom error classes in api/errors.ts
class BadRequestError extends Error {
  statusCode = 400
}
class UnauthorizedError extends Error {
  statusCode = 401  // Authentication failed
}
class ForbiddenError extends Error {
  statusCode = 403  // Authorization failed
}

// Centralized error handler in api/errorHandler.ts
app.use(errorHandler)
```

**Error Types:**
- **400 Bad Request**: Missing required fields, invalid input
- **401 Unauthorized**: Invalid login credentials
- **403 Forbidden**: Access denied (authorization)
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Unexpected server errors

### 4. Middleware Architecture

Three key middleware functions demonstrate different patterns:

1. **`middlewareLogResponses`** - Logs non-successful responses
2. **`middlewareMetricsInc`** - Tracks page visits
3. **`errorHandler`** - Centralized error handling

### 5. Automatic Database Migrations

Migrations run automatically when the server starts:

```typescript
// In index.ts - runs before server startup
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
console.log('✅ Database migrations completed');
```

### 6. Configuration Management

Enhanced configuration with environment variables in `config.ts`:

```typescript
import { loadEnvFile } from 'node:process';

loadEnvFile(); // Loads .env file

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow('PORT')),
        platform: envOrThrow('PLATFORM'),
    },
    db: {
        url: envOrThrow('DB_URL'),
        migrationConfig: migrationConfig,
    },
};
```

Features:

- Automatic `.env` file loading using Node.js built-in `loadEnvFile()`
- Helper function `envOrThrow()` for required environment variables
- Type-safe configuration with nested structure
- Organized separation of API and database config

### 7. Database Schema & Data Transformation

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
    email: varchar('email', { length: 255 }).notNull().unique(),
    hashedPassword: varchar('hashed_password', { length: 255 })
        .notNull()
        .default('unset'),
});

export const chirps = pgTable('chirps', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar('body', { length: 140 }).notNull(),
    user_id: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
});
```

**Database Features:**

- UUID primary keys for better distribution
- Automatic timestamp management
- Foreign key relationships with cascade delete
- Type-safe insert operations with `NewUser` and `NewChirp` types
- Ordered queries (chirps sorted by creation date ascending)
- Individual record retrieval by ID with proper error handling

**Data Transformation:**
The API transforms database snake_case to camelCase for responses:

```typescript
// Database returns: { user_id: "uuid" }
// API responds with: { userId: "uuid" }
const response = {
    // ... other fields
    userId: chirp.user_id, // Transform snake_case to camelCase
};
```

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
- **Dependencies**: Express.js, Drizzle ORM, PostgreSQL client, and bcrypt for password hashing

### Drizzle Configuration (`drizzle.config.ts`)

- **Dialect**: PostgreSQL
- **Schema**: Located at `./src/db/schema.ts`
- **Migrations**: Output to `./src/db/migrations`
- **Connection**: Uses `DB_URL` environment variable
- **Environment**: Automatically loads `.env` file using Node.js `loadEnvFile()`

## 🎓 Learning Exercises

1. ✅ **Connect the database**: Create a database client and connect to PostgreSQL
2. ✅ **Implement user registration**: Create a `POST /api/users` endpoint using the users table
3. ✅ **Add chirps table**: Design and implement a chirps table with user relationships
4. ✅ **Persist chirps**: Update the validate endpoint to save chirps to the database
5. ✅ **Add automatic migrations**: Set up migrations to run on server startup
6. ✅ **Add GET endpoints for chirps**: Implement `GET /api/chirps` and `GET /api/chirps/:id`
7. ✅ **Add authentication**: Implement password hashing and login functionality
8. **Add GET endpoint for users**: Implement `GET /api/users` endpoint
9. **Add pagination**: Implement pagination for chirps list
10. **Add filtering**: Filter chirps by user or date range

## 🚀 Next Steps

With the core functionality complete, here's the development roadmap:

### Immediate Tasks

- ✅ Set up environment variables for database credentials
- ✅ Create database connection and queries
- ✅ Integrate database operations into API endpoints
- ✅ Add chirps table with user relationships
- ✅ Implement automatic migrations

### Future Enhancements

- **Session Management**: JWT tokens or session-based authentication
- **User retrieval**: Add `GET /api/users` endpoint
- **Password reset**: Email-based password reset functionality
- **Pagination**: Add pagination support to chirps listing
- **Real-time updates**: WebSocket integration for live chirps
- **File uploads**: Profile pictures and media attachments
- **Social features**: Following, likes, and retweets
- **Search functionality**: Full-text search for chirps
- **Rate limiting**: Redis-based rate limiting
- **Caching**: Implement caching layer for performance

## 📝 Development Notes

- **Database**: PostgreSQL with automatic migrations on server startup
- **Authentication**: bcrypt password hashing with 10 salt rounds
- **Security**: Passwords never returned in API responses, unique email enforcement
- **Profanity filter**: Replaces "kerfuffle", "sharbert", "fornax" with `****`
- **Data format**: Database uses snake_case, API responses use camelCase
- **Error handling**: Centralized error handler with proper HTTP status codes (401, 403, etc.)
- **Metrics**: In-memory storage for file server hits (resets on restart)
- **RESTful design**: All endpoints use pluralized resource names

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
