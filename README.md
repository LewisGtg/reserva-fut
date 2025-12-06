# Reserva Fut 🎾⚽

A minimal and efficient court booking platform MVP built with NestJS and Prisma. This application enables sports facilities to manage courts and allows players to book time slots seamlessly.

## 🚀 Features

- **User Management**: Player and Manager roles with authentication
- **Establishment Management**: Create and manage sports facilities
- **Court Management**: Define courts with pricing and availability
- **Schedule Management**: Create and manage time slots for courts
- **Booking System**: Players can book available time slots
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **Health Check**: Public health endpoint for monitoring

## 🛠️ Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: class-validator and class-transformer
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js >= 18.18.0
- npm >= 9.0.0 or pnpm
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LewisGtg/reserva-fut.git
   cd reserva-fut
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=DEV
   PORT=3000
   DATABASE_URL="file:./prisma/dev.db"
   SECRET_KEY=your_secret_key_here
   ```

   > **Note**: Generate a secure `SECRET_KEY` for production use.

4. **Set up the database**
   ```bash
   # Run migrations
   npm run prisma:migrate
   
   # (Optional) Seed the database
   npm run prisma:seed
   ```

5. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode
```bash
npm run start
```

### Health Check
```bash
curl http://localhost:3000/health
```

## 📊 Database Management

### Prisma Studio
Open Prisma Studio to visually manage your database:
```bash
npm run prisma:studio
```

Access it at `http://localhost:5555`

### Migrations
```bash
# Create and apply a new migration
npm run prisma:migrate

# Reset database (careful: deletes all data)
npm run prisma:reset
```

### Seeding
```bash
# Seed the database with sample data
npm run prisma:seed

# Reset and seed
npm run db:reset
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
reserva-fut/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migrations
├── src/
│   ├── common/
│   │   └── config/            # Configuration files
│   ├── database/
│   │   ├── prisma.module.ts   # Prisma module
│   │   └── prisma.service.ts  # Prisma service
│   └── modules/
│       ├── app/               # App module (health check)
│       ├── auth/              # Authentication module
│       ├── users/             # User management
│       ├── establishments/    # Establishment management
│       ├── courts/            # Court management
│       ├── schedules/         # Schedule management
│       └── bookings/          # Booking management
├── test/                      # E2E tests
└── package.json
```

## 📚 API Endpoints

### Public Endpoints
- `GET /health` - Health check endpoint (no authentication required)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration (if implemented)

### Protected Endpoints (Require JWT)
- **Users**: `/users/*`
- **Establishments**: `/establishments/*`
- **Courts**: `/courts/*`
- **Schedules**: `/schedules/*`
- **Bookings**: `/bookings/*`

> All protected endpoints require an `Authorization: Bearer <token>` header.

## 🗃️ Database Schema

### Core Entities
- **User**: Players and Managers
- **Establishment**: Sports facilities
- **Court**: Individual courts within establishments
- **Schedule**: Available time slots for courts
- **Booking**: Reservations made by players
- **EstablishmentManager**: Junction table for manager-establishment relationships

## 🔐 Authentication

The application uses JWT-based authentication:

1. Obtain a token by logging in via `/auth/login`
2. Include the token in the `Authorization` header: `Bearer <your_token>`
3. Use the `@Public()` decorator to make specific routes publicly accessible

## 🧹 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```
