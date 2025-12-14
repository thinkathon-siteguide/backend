# SiteGuard Backend

A robust Node.js backend API built with Express, TypeScript, and MongoDB for construction project management. SiteGuard Backend provides RESTful endpoints for workspace management, resource tracking, architecture planning, safety monitoring, and user authentication.

## Overview

SiteGuard Backend is the server-side application that powers the SiteGuard construction management platform. It provides secure APIs for managing construction workspaces, tracking resources, generating architecture plans, monitoring safety, and handling user authentication with JWT tokens.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework
- **TypeScript 5.9.3** - Type-safe development
- **MongoDB with Mongoose 9.0.0** - Database and ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcryptjs 3.0.3** - Password hashing
- **Winston 3.18.3** - Logging
- **Helmet 8.1.0** - Security middleware
- **CORS 2.8.5** - Cross-origin resource sharing
- **Zod 4.1.13** - Schema validation
- **Jest 30.2.0** - Testing framework
- **Supertest 7.1.4** - API testing

## Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── config/                   # Configuration files
│   │   └── config.ts             # Environment configuration with Zod validation
│   ├── core/                     # Core utilities
│   │   ├── database.ts           # MongoDB connection
│   │   ├── logger.ts             # Winston logger setup
│   │   ├── error.response.ts     # Custom error classes
│   │   └── success.response.ts   # Success response handler
│   ├── middlewares/              # Express middlewares
│   │   ├── auth.middleware.ts    # JWT authentication middleware
│   │   ├── error.middleware.ts   # Global error handler
│   │   └── workspace.middleware.ts
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication module
│   │   │   ├── User.ts           # User model
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   ├── workspace/            # Workspace management
│   │   │   ├── models/
│   │   │   │   └── Workspace.ts  # Workspace model
│   │   │   ├── workspace.controller.ts
│   │   │   ├── workspace.service.ts
│   │   │   └── workspace.routes.ts
│   │   ├── resource/             # Resource management
│   │   │   ├── resource.controller.ts
│   │   │   ├── resource.service.ts
│   │   │   └── resource.routes.ts
│   │   ├── architecture/         # Architecture plans
│   │   │   ├── architecture.controller.ts
│   │   │   ├── architecture.service.ts
│   │   │   └── architecture.routes.ts
│   │   └── health/               # Health check
│   │       ├── health.controller.ts
│   │       └── health.routes.ts
│   └── utils/                    # Utility functions
│       └── asyncHandler.ts       # Async route handler wrapper
├── logs/                         # Log files directory
│   ├── all.log                   # All logs
│   └── error.log                 # Error logs only
├── .env.example                  # Environment variables template
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest test configuration
├── eslint.config.js              # ESLint configuration
├── .prettierrc                   # Prettier configuration
└── package.json                  # Dependencies and scripts
```

## Features

### 1. Authentication & Authorization

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with authentication middleware
- User session management

### 2. Workspace Management

- Create, read, update, and delete workspaces
- User-scoped workspace access (users only see their workspaces)
- Track project progress, status, and safety scores
- Default resource initialization on workspace creation
- Workspace status toggling (Under Construction/Finished)
- Progress tracking (0-100%)

### 3. Resource Management

- CRUD operations for inventory items
- Automatic status calculation (Good/Low/Critical) based on thresholds
- Bulk resource replacement
- Quantity updates
- Resource statistics
- Default resources: Cement, Sand, Granite, Iron Rods, Blocks

### 4. Architecture Planning

- Save and retrieve architecture plans per workspace
- Manage architecture sections
- Manage materials with specifications
- Manage construction stages with phases, durations, and tasks
- Full CRUD operations for architecture data

### 5. Safety Monitoring

- Store safety reports per workspace
- Risk score tracking (0-100)
- Hazard identification with severity levels (Low/Medium/High)
- Safety recommendations
- Historical safety report tracking

### 6. Health Monitoring

- Health check endpoint for monitoring
- System status verification

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Environment variables configured

### Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory (see Environment Variables section below):

```bash
cp .env.example .env
```

4. Start MongoDB:

Ensure MongoDB is running locally or configure connection string for remote instance.

5. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:4000` (or the port specified in your `.env`)

### Build for Production

```bash
npm run build
```

The compiled JavaScript will be in the `dist/` directory.

### Run Production Server

```bash
npm start
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/siteguard
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
```

### Variable Descriptions

- `NODE_ENV`: Environment mode (`development`, `production`, `test`)
- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (use a strong random string)
- `JWT_EXPIRES_IN`: Token expiration time (e.g., `1d`, `7d`, `24h`)
- `CORS_ORIGIN`: Allowed CORS origin (use `*` for all origins in development)

## Architecture & Design Patterns

### MVC Pattern

The backend follows a modular MVC-like structure:

- **Models**: Mongoose schemas (User, Workspace)
- **Views**: JSON responses (RESTful API)
- **Controllers**: Request handlers in `*.controller.ts`
- **Services**: Business logic in `*.service.ts`
- **Routes**: Express route definitions in `*.routes.ts`

### Module Structure

Each feature module is self-contained:

```
module/
├── *.controller.ts    # Handle HTTP requests/responses
├── *.service.ts       # Business logic
├── *.routes.ts        # Route definitions
├── models/            # Database models (if needed)
└── *.test.ts          # Unit tests
```

### Error Handling

- Custom error classes extending `ApiError`
- Global error handler middleware
- Consistent error response format
- Error logging with Winston
- Development vs production error responses

### Authentication Flow

1. User submits credentials (login/signup)
2. Server validates and creates JWT token
3. Token returned to client
4. Client includes token in `Authorization: Bearer <token>` header
5. `protect` middleware validates token on protected routes
6. User object attached to request for use in controllers

### Database Schema

**User Model:**

- `name`: String (required)
- `email`: String (required, unique, lowercase)
- `password`: String (required, hashed, not selected by default)
- `createdAt`, `updatedAt`: Timestamps

**Workspace Model:**

- `userId`: ObjectId (required, references User)
- `name`: String (required, 3-100 chars)
- `location`: String (required)
- `stage`: String (required)
- `type`: String (required)
- `budget`: String (required)
- `status`: Enum ['Under Construction', 'Finished']
- `progress`: Number (0-100)
- `safetyScore`: Number (0-100)
- `lastUpdated`: Date
- `resources`: Array of ResourceItem
- `architecturePlan`: ArchitecturePlan (optional)
- `safetyReports`: Array of SafetyReport
- `createdAt`, `updatedAt`: Timestamps

## API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
  - Body: `{ name, email, password }`
- `POST /auth/login` - Login user
  - Body: `{ email, password }`

### Workspaces

- `GET /workspaces` - Get all workspaces (authenticated, user-scoped)
- `GET /workspaces/:id` - Get workspace by ID
- `POST /workspaces` - Create workspace
  - Body: `{ name, location, stage, type, budget }`
- `PUT /workspaces/:id` - Update workspace
- `DELETE /workspaces/:id` - Delete workspace
- `PATCH /workspaces/:id/progress` - Update progress
  - Body: `{ progress: number }`
- `PATCH /workspaces/:id/status` - Toggle status

### Resources

- `GET /workspaces/:workspaceId/resources` - Get all resources
- `POST /workspaces/:workspaceId/resources` - Add resource
  - Body: `{ name, quantity, unit, threshold }`
- `PUT /workspaces/:workspaceId/resources` - Bulk replace resources
  - Body: `{ resources: Array }`
- `GET /workspaces/:workspaceId/resources/statistics` - Get resource statistics
- `GET /workspaces/:workspaceId/resources/:resourceId` - Get resource by ID
- `PUT /workspaces/:workspaceId/resources/:resourceId` - Update resource
- `DELETE /workspaces/:workspaceId/resources/:resourceId` - Delete resource
- `PATCH /workspaces/:workspaceId/resources/:resourceId/quantity` - Update quantity
  - Body: `{ quantity: number }`

### Architecture

- `GET /workspaces/:workspaceId/architecture` - Get architecture plan
- `POST /workspaces/:workspaceId/architecture` - Save architecture plan
- `PUT /workspaces/:workspaceId/architecture` - Update architecture plan
- `DELETE /workspaces/:workspaceId/architecture` - Delete architecture plan
- `GET /workspaces/:workspaceId/architecture/sections` - Get sections
- `POST /workspaces/:workspaceId/architecture/sections` - Add section
- `GET /workspaces/:workspaceId/architecture/materials` - Get materials
- `POST /workspaces/:workspaceId/architecture/materials` - Add material
- `GET /workspaces/:workspaceId/architecture/stages` - Get stages
- `POST /workspaces/:workspaceId/architecture/stages` - Add stage

### Safety Reports

- `GET /workspaces/:workspaceId/safety-reports` - Get all safety reports
- `POST /workspaces/:workspaceId/safety-reports` - Save safety report
  - Body: `{ riskScore, hazards, summary }`
- `GET /workspaces/:workspaceId/safety-reports/:reportId` - Get report by ID

### Health

- `GET /health` - Health check endpoint

## Response Format

### Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "code": 400,
  "type": "BadRequestError",
  "message": "Error message",
  "errors": []
}
```

## Security Features

- **Helmet**: Sets secure HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schema validation
- **Body Size Limits**: 10kb limit on request bodies
- **Error Handling**: No sensitive information in production errors

## Logging

Winston logger configured with:

- **Console transport**: Colored output for development
- **File transport**: All logs to `logs/all.log`
- **Error file transport**: Errors to `logs/error.log`
- **Log levels**: error, warn, info, http, debug
- **Timestamp**: ISO format timestamps

## Testing

### Run Tests

```bash
npm test
```

### Test Structure

- Test files: `*.test.ts` alongside source files
- Framework: Jest with ts-jest
- Coverage: Enabled with lcov reports
- Mocking: Automatic mock clearing and restoration

### Example Test Files

- `src/app.test.ts`
- `src/core/database.test.ts`
- `src/modules/auth/auth.routes.test.ts`
- `src/modules/workspace/workspace.service.test.ts`

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- Consistent naming:
  - Files: kebab-case for routes, camelCase for others
  - Functions: camelCase
  - Classes: PascalCase
  - Constants: UPPER_SNAKE_CASE

### Async Handling

All async route handlers should use the `asyncHandler` utility:

```typescript
import { asyncHandler } from '../utils/asyncHandler';

router.get(
  '/',
  asyncHandler(async (req, res) => {
    // async code here
  })
);
```

### Error Handling

Use custom error classes:

```typescript
import { NotFoundError, BadRequestError } from '../core/error.response';

if (!workspace) {
  throw new NotFoundError('Workspace not found');
}
```

### Database Queries

Always scope queries to the authenticated user:

```typescript
const workspace = await Workspace.findOne({
  _id: workspaceId,
  userId: userId
});
```

### Adding New Features

1. Create module directory in `src/modules/`
2. Define model (if needed) in `models/`
3. Create service with business logic
4. Create controller with request handlers
5. Define routes
6. Register routes in `app.ts`
7. Add tests

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm test` - Run tests
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier

## Database Models

### User Schema

```typescript
{
  name: string;
  email: string (unique, lowercase);
  password: string (hashed, not selected by default);
  createdAt: Date;
  updatedAt: Date;
}
```

### Workspace Schema

```typescript
{
  userId: ObjectId;
  name: string;
  location: string;
  stage: string;
  type: string;
  budget: string;
  status: 'Under Construction' | 'Finished';
  progress: number (0-100);
  safetyScore: number (0-100);
  lastUpdated: Date;
  resources: ResourceItem[];
  architecturePlan?: ArchitecturePlan;
  safetyReports: SafetyReport[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Middlewares

### Authentication Middleware (`protect`)

- Validates JWT token from Authorization header
- Attaches user object to request
- Used on all protected routes

### Error Middleware

- Global error handler
- Converts errors to consistent JSON format
- Logs errors with Winston
- Different responses for development/production

### Workspace Middleware

- Validates workspace access
- Ensures user owns workspace

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB connection string
4. Set appropriate `CORS_ORIGIN`
5. Enable HTTPS
6. Configure reverse proxy (nginx, etc.)
7. Set up process manager (PM2, systemd)
8. Configure logging rotation
9. Enable database backups
10. Set up monitoring and alerts

### Recommended Setup

- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **Database**: MongoDB Atlas or managed instance
- **Logging**: Centralized logging service
- **Monitoring**: Application performance monitoring (APM)

## License

Copyright © ThinkLab Group
