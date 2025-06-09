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
| POST | `/api/login` | Authenticate user login | `{"email": "user@example.com", "password": "securePass123"}` | `200` with user object, JWT token, and refresh token |
| POST | `/api/refresh` | Get new access token (🔒 **Refresh Token**) | None + Authorization header with refresh token | `200` with new JWT token |
| POST | `/api/revoke` | Revoke refresh token (🔒 **Refresh Token**) | None + Authorization header with refresh token | `204` No Content |
| POST | `/api/chirps` | Create a new chirp (🔒 **Authenticated**) | `{"body": "Hello world!"}` + Authorization header | `201` with chirp object |
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
JWT_SECRET=your-super-secure-secret-here
```

**Generate a secure JWT secret:**

```bash
# Use OpenSSL to generate a cryptographically secure 64-byte base64 secret
openssl rand -base64 64
```

Copy the output and use it as your `JWT_SECRET` in the `.env` file. This ensures your JWT tokens are signed with a strong, random secret.

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

**User Login** with JWT token generation:

```bash
# User login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword123"}'

# Response includes both access token (JWT) and refresh token:
# {
#   "id": "user-uuid",
#   "createdAt": "2023-07-01T00:00:00.000Z",
#   "updatedAt": "2023-07-01T00:00:00.000Z",
#   "email": "user@example.com",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refreshToken": "56aa826d22baab4b5ec2cea41a59ecbba03e542aedbb31d9b80326ac8ffcfa2a"
# }
```

**JWT Authentication Lifecycle:**

1. **User Authentication**: User submits email and password to `/api/login`
2. **Token Generation**: Server validates credentials and creates JWT with user ID in `sub` field
3. **Client Storage**: Client receives and stores JWT token
4. **Authenticated Requests**: Client includes JWT in Authorization header for protected endpoints
5. **Token Validation**: Server validates JWT on each authenticated request

```bash
# Example: Creating an authenticated chirp
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"body": "Hello world! This is my authenticated chirp!"}'
```

**Security Features:**
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with expiration timestamps
- Secure token validation with signature verification
- User ID stored in JWT `sub` field (subject)
- Hashed passwords never returned in API responses
- Email uniqueness enforced at database level

### 2. JWT Authentication Functions

The project implements several key authentication functions:

**`getBearerToken(req: Request): string`**

Extracts JWT tokens from the Authorization header:

```typescript
export function getBearerToken(req: Request): string {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid authorization header');
    }
    return authHeader.split(' ')[1]; // Returns just the token string
}
```

**Enhanced Login Handler**

Now generates JWT tokens with configurable expiration:

```typescript
export async function handlerLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    let expiresIn = req.body.expiresIn;
    
    // Validate credentials...
    
    // Handle expiration (default 1 hour, max 1 hour)
    if (!expiresIn || expiresIn > 3600 || expiresIn < 0) {
        expiresIn = 3600;
    }
    
    // Generate JWT and return user with token
    const userResponse = {
        // ...user fields,
        token: makeJWT(user.id, expiresIn, config.api.jwtSecret)
    };
    res.status(200).json(userResponse);
}
```

### 3. Authenticated Chirp Creation

The `/api/chirps` endpoint is now **protected** and requires JWT authentication:

```typescript
export async function handlerCreateChirp(req: Request, res: Response) {
    const { body } = req.body;
    const token = getBearerToken(req);           // Extract JWT from header
    const userId = validateJWT(token, config.api.jwtSecret); // Validate & get user ID
    
    // Chirp validation and creation...
    const chirp = await createChirp({
        body: cleanedBody,
        user_id: userId  // User ID comes from validated JWT
    });
}
```

**Authentication Features:**

- JWT token extraction from `Authorization: Bearer <token>` header
- Automatic user identification from JWT `sub` field
- No need to send `userId` in request body (extracted from token)
- Comprehensive error handling for missing/invalid tokens

**Example Authenticated Request:**

```bash
# Get JWT token from login
TOKEN=$(curl -s -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}' \
  | jq -r '.token')

# Use token to create chirp
curl -X POST http://localhost:8080/api/chirps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"body": "Hello authenticated world!"}'
```

### 4. Refresh Token System

The application implements a comprehensive refresh token system for secure, long-term authentication. This allows users to stay logged in for extended periods while maintaining security through short-lived access tokens.

#### **Session Store Design**

Refresh tokens are stored in a database table rather than being stateless JWTs. This approach provides several advantages:
- **Server-side validation**: Direct database lookup for token verification
- **Immediate revocation**: Tokens can be invalidated instantly
- **User association**: Each token is explicitly linked to a user account
- **Audit trail**: Creation, expiration, and revocation timestamps

#### **Refresh Token Database Schema**

```typescript
export const refreshTokens = pgTable('refresh_tokens', {
    token: varchar('token', { length: 255 }).primaryKey(),        // Random 256-bit hex string
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
    user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),                 // 60 days from creation
    revokedAt: timestamp('revoked_at'),                           // null = active, timestamp = revoked
});
```

**Schema Features:**
- **Primary Key**: Token string itself serves as the primary key
- **Foreign Key Cascade**: When a user is deleted, all refresh tokens are automatically removed
- **Expiration Management**: Database-level timestamp tracking
- **Revocation Support**: `revoked_at` field enables immediate token invalidation

#### **Refresh Token Generation**

```typescript
export function makeRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex'); // 256-bit cryptographically secure random string
}
```

**Technical Details:**
- Uses Node.js built-in `crypto.randomBytes()` for cryptographic randomness
- Generates 32 bytes (256 bits) of random data
- Converts to hexadecimal string for storage and transmission
- Results in 64-character hex string (32 bytes × 2 hex chars per byte)

#### **Enhanced Login Response**

```typescript
// POST /api/login response includes both tokens
{
  "id": "user-uuid",
  "createdAt": "2023-07-01T00:00:00.000Z",
  "updatedAt": "2023-07-01T00:00:00.000Z",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",        // JWT (1 hour)
  "refreshToken": "56aa826d22baab4b5ec2cea41a59ecbba03e542aedbb31d9b80326ac8ffcfa2a"  // 60 days
}
```

#### **Token Refresh Flow (POST /api/refresh)**

```bash
# Use refresh token to get new access token
curl -X POST http://localhost:8080/api/refresh \
  -H "Authorization: Bearer 56aa826d22baab4b5ec2cea41a59ecbba03e542aedbb31d9b80326ac8ffcfa2a"

# Response with new JWT access token:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }
```

**Refresh Process:**
1. Extract refresh token from `Authorization: Bearer <token>` header
2. Database lookup to validate token exists and is not expired/revoked
3. Generate new JWT access token for the associated user
4. Return new access token (refresh token remains valid)

#### **Token Revocation (POST /api/revoke)**

```bash
# Revoke a refresh token (logout)
curl -X POST http://localhost:8080/api/revoke \
  -H "Authorization: Bearer 56aa826d22baab4b5ec2cea41a59ecbba03e542aedbb31d9b80326ac8ffcfa2a"

# Returns 204 No Content (successful revocation)
```

**Revocation Process:**
1. Extract refresh token from Authorization header
2. Update database record: set `revoked_at` to current timestamp
3. Update `updated_at` timestamp for audit trail
4. Return 204 No Content (successful, no response body)

#### **Security Features**

- **Token Separation**: Access tokens (JWT, 1 hour) vs refresh tokens (database, 60 days)
- **Cryptographic Generation**: 256-bit random tokens using `crypto.randomBytes()`
- **Database Validation**: Server-side token verification prevents tampering
- **Immediate Revocation**: Database-based revocation for instant logout
- **Cascade Deletion**: User deletion automatically cleans up all tokens
- **Expiration Tracking**: Both creation and expiration timestamps stored
- **Audit Trail**: Full lifecycle tracking (created, updated, revoked timestamps)

### 5. Custom Error Handling

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
- **401 Unauthorized**: Invalid login credentials, expired/invalid JWT
- **403 Forbidden**: Access denied (authorization)
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Unexpected server errors

### 6. JWT Implementation Details

The project uses JSON Web Tokens for stateless authentication:

```typescript
// JWT token structure
{
  "iss": "chirpy",           // Issuer
  "sub": "user-uuid-here",   // Subject (user ID)
  "iat": 1699564800,         // Issued at (timestamp)
  "exp": 1699651200          // Expiration (timestamp)
}

// Token creation (src/api/auth.ts)
export function makeJWT(userId: string, expiresIn: number, secret: string): string {
    const payload = {
        iss: 'chirpy',
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: iat + expiresIn
    };
    return jwt.sign(payload, secret);
}

// Token validation (src/api/auth.ts)
export function validateJWT(tokenString: string, secret: string): string {
    const payload = jwt.verify(tokenString, secret);
    return payload.sub; // Returns user ID
}

// Usage with config (secret from environment)
const token = makeJWT(userId, 3600, config.api.jwtSecret);
const userId = validateJWT(token, config.api.jwtSecret);
```

**JWT Security:**

- JWT secret loaded from `JWT_SECRET` environment variable
- Secret generated using `openssl rand -base64 64` for cryptographic strength
- 512-bit (64-byte) secret provides strong signature security
- Secret stored securely in `.env` file (never committed to version control)

### 5. Middleware Architecture

Three key middleware functions demonstrate different patterns:

1. **`middlewareLogResponses`** - Logs non-successful responses
2. **`middlewareMetricsInc`** - Tracks page visits
3. **`errorHandler`** - Centralized error handling

### 7. Automatic Database Migrations

Migrations run automatically when the server starts:

```typescript
// In index.ts - runs before server startup
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
console.log('✅ Database migrations completed');
```

### 8. Configuration Management

Enhanced configuration with environment variables in `config.ts`:

```typescript
import { loadEnvFile } from 'node:process';

loadEnvFile(); // Loads .env file

export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow('PORT')),
        platform: envOrThrow('PLATFORM'),
        jwtSecret: envOrThrow('JWT_SECRET'),
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

### 9. Database Schema & Data Transformation

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
  - `test`: Run Vitest test suite
- **Dependencies**: Express.js, Drizzle ORM, PostgreSQL client, bcrypt, and jsonwebtoken
- **Dev Dependencies**: Vitest for testing, TypeScript definitions

### Drizzle Configuration (`drizzle.config.ts`)

- **Dialect**: PostgreSQL
- **Schema**: Located at `./src/db/schema.ts`
- **Migrations**: Output to `./src/db/migrations`
- **Connection**: Uses `DB_URL` environment variable
- **Environment**: Automatically loads `.env` file using Node.js `loadEnvFile()`

## 🧪 Testing

The project includes a comprehensive test suite using Vitest:

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch
```

### Test Coverage

- **Authentication Tests** (`src/api/auth.test.ts`):
  - Password hashing and verification
  - JWT token creation and validation
  - Token expiration handling
  - Invalid token error handling

### Example Test

```typescript
import { describe, it, expect } from 'vitest';
import { makeJWT, validateJWT } from './auth';

describe('JWT Authentication', () => {
    it('should create and validate JWT tokens', () => {
        const userId = 'user-123';
        const secret = 'test-secret';
        const token = makeJWT(userId, 3600, secret);
        
        const extractedId = validateJWT(token, secret);
        expect(extractedId).toBe(userId);
    });
});
```

## 🎓 Learning Exercises

1. ✅ **Connect the database**: Create a database client and connect to PostgreSQL
2. ✅ **Implement user registration**: Create a `POST /api/users` endpoint using the users table
3. ✅ **Add chirps table**: Design and implement a chirps table with user relationships
4. ✅ **Persist chirps**: Update the validate endpoint to save chirps to the database
5. ✅ **Add automatic migrations**: Set up migrations to run on server startup
6. ✅ **Add GET endpoints for chirps**: Implement `GET /api/chirps` and `GET /api/chirps/:id`
7. ✅ **Add authentication**: Implement password hashing and login functionality
8. ✅ **Add JWT tokens**: Implement JWT creation and validation with tests
9. ✅ **Add Bearer token extraction**: Implement `getBearerToken` function
10. ✅ **Protect chirps endpoint**: Add JWT authentication to chirp creation
11. ✅ **Token expiration handling**: Add configurable token expiration in login
12. ✅ **Add refresh token system**: Implement refresh token database and endpoints
13. ✅ **Add token refresh**: Create `/api/refresh` endpoint for getting new access tokens
14. ✅ **Add token revocation**: Create `/api/revoke` endpoint for logout functionality
15. **Add authorization middleware**: Create reusable JWT middleware for multiple endpoints
16. **Add GET endpoint for users**: Implement `GET /api/users` endpoint
17. **Add pagination**: Implement pagination for chirps list
18. **Add filtering**: Filter chirps by user or date range

## 🚀 Next Steps

With the core functionality complete, here's the development roadmap:

### Immediate Tasks

- ✅ Set up environment variables for database credentials
- ✅ Create database connection and queries
- ✅ Integrate database operations into API endpoints
- ✅ Add chirps table with user relationships
- ✅ Implement automatic migrations

### Future Enhancements

- **Authorization Middleware**: Reusable JWT middleware for protecting multiple endpoints
- **Refresh Token Rotation**: Automatic refresh token rotation on each use
- **User retrieval**: Add `GET /api/users` endpoint
- **Password reset**: Email-based password reset functionality
- **Session Management**: Multiple device login tracking
- **Pagination**: Add pagination support to chirps listing
- **Real-time updates**: WebSocket integration for live chirps
- **File uploads**: Profile pictures and media attachments
- **Social features**: Following, likes, and retweets
- **Search functionality**: Full-text search for chirps
- **Rate limiting**: Redis-based rate limiting
- **Caching**: Implement caching layer for performance

## 📝 Development Notes

- **Database**: PostgreSQL with automatic migrations on server startup
- **Authentication**: Complete JWT + refresh token authentication system
  - bcrypt password hashing with 10 salt rounds
  - JWT access tokens (1 hour expiration) + refresh tokens (60 days)
  - Bearer token extraction from Authorization headers
  - User ID automatically extracted from JWT `sub` field
  - Cryptographically secure refresh tokens (256-bit random)
- **Protected Endpoints**: Chirp creation requires valid JWT authentication
- **Token Management**: Database-stored refresh tokens with revocation support
- **Security**: OpenSSL-generated JWT secrets, passwords never returned in responses
- **Testing**: Vitest test suite for authentication functionality
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
