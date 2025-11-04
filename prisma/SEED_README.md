# Database Seeding Guide

## Overview

This guide explains how to use the database seed scripts to populate your SQLite database with realistic test data for development and testing purposes.

## Quick Start

```bash
# Run the seed script
npm run db:seed

# Or use Prisma's native seed command
npm run prisma:seed

# Reset database and re-seed (WARNING: Deletes all data)
npm run db:reset
```

## What Gets Seeded

The seed script populates the database with:

### 👥 Users (5 total)
- **3 Players**: Regular users who can make bookings
- **2 Managers**: Users who can manage establishments

### 🏢 Establishments (3 total)
- Each with a manager relationship
- Various types: Indoor Soccer Complex, Outdoor Sports Park, Premium Courts

### 🎾 Courts (9 total)
- Distributed across the 3 establishments
- Different court types: Football, Futsal, Volleyball, Padel, Tennis
- Varied sizes and surface types

### 📅 Schedules (~882 total)
- **7 days** of availability (starting from today)
- **14 time slots** per day (8:00 AM - 10:00 PM)
- Created for **all 9 courts**
- ~30% marked as reserved (unavailable for booking)

### 📝 Bookings (~25 total)
- Mix of confirmed and cancelled bookings
- Realistic distribution across users and schedules
- Includes payment status variations

## Test Credentials

After seeding, you can use these credentials for testing:

### Players
```
Email: player1@example.com
Password: Player123!

Email: player2@example.com
Password: Player123!

Email: player3@example.com
Password: Player123!
```

### Managers
```
Email: manager1@example.com
Password: Manager123!

Email: manager2@example.com
Password: Manager123!
```

## Script Commands

### `npm run db:seed`
- Runs the seed script directly
- **Deletes all existing data** before seeding
- Creates fresh test data
- Shows summary of created records

### `npm run prisma:seed`
- Same as `db:seed`
- Uses Prisma's native seed configuration

### `npm run db:reset`
- **Drops the entire database**
- Runs all migrations from scratch
- Runs the seed script
- ⚠️ **USE WITH CAUTION** - Cannot be undone

### `npm run prisma:reset`
- Prisma's native reset command
- Automatically runs seed after reset

## Seed Script Structure

```
prisma/
├── seed.ts           # Main seed script
├── tsconfig.json     # TypeScript config for seed
└── SEED_README.md    # This file
```

### Seed Functions

The `seed.ts` file is organized into modular functions:

```typescript
async function seedUsers()           // Creates users with hashed passwords
async function seedEstablishments()  // Creates establishments with managers
async function seedCourts()          // Creates courts for each establishment
async function seedSchedules()       // Creates 7 days of time slots
async function seedBookings()        // Creates realistic bookings
async function main()                // Orchestrates the seeding process
```

## Customizing Seed Data

### Change Number of Days

```typescript
// In seedSchedules() function
const numberOfDays = 7; // Change this value
```

### Change Time Slots

```typescript
// In seedSchedules() function
const startHour = 8;  // Start time (8 AM)
const endHour = 22;   // End time (10 PM)
```

### Change Reserved Schedule Percentage

```typescript
// In seedSchedules() function
const isReserved = Math.random() < 0.3; // 30% reserved
```

### Add More Users/Establishments/Courts

Edit the respective seed functions in `seed.ts` and add more objects to the data arrays.

## Best Practices

### ✅ When to Use Seeding

- **Development**: Get realistic data quickly
- **Testing**: Consistent test data across environments
- **Demos**: Show features with realistic examples
- **Onboarding**: Help new developers get started

### ⚠️ When NOT to Use Seeding

- **Production**: Never run seed scripts in production
- **User data exists**: Seeding deletes all existing data
- **Migrations**: Seeds run after migrations, not before

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors, ensure the `prisma/tsconfig.json` exists:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}
```

### Foreign Key Errors

If you get foreign key constraint errors, ensure seed functions run in this order:
1. Users (no dependencies)
2. Establishments (depends on Users for managers)
3. Courts (depends on Establishments)
4. Schedules (depends on Courts)
5. Bookings (depends on Users and Schedules)

### ts-node Not Found

Install ts-node as a dev dependency:

```bash
npm install --save-dev ts-node
```

### Prisma Client Not Generated

Generate the Prisma Client first:

```bash
npm run prisma:generate
```

## Integration with Testing

The seed script uses similar mock data patterns as the test files:

```
Test Mocks (In-Memory)          Seed Data (Database)
├── users.mock.ts      →        seedUsers()
├── courts.mock.ts     →        seedCourts()
├── establishments.mock.ts →    seedEstablishments()
├── schedules.mock.ts  →        seedSchedules()
└── bookings.mock.ts   →        seedBookings()
```

This ensures consistency between your test data and development data.

## Summary Output

After running the seed script, you'll see output like:

```
🌱 Seeding database...

✅ Database seeded successfully!

📊 Summary:
- Users: 5
- Establishments: 3
- Courts: 9
- Schedules: 882
- Bookings: 25

🔑 Test Credentials:
Players:
- player1@example.com / Player123!
- player2@example.com / Player123!
- player3@example.com / Player123!

Managers:
- manager1@example.com / Manager123!
- manager2@example.com / Manager123!
```

## Related Documentation

- `../COMPLETE_TEST_SUMMARY.md` - Overview of all test suites
- `../src/modules/*/README.md` - Module-specific testing docs
- `schema.prisma` - Database schema reference

## Support

For issues or questions:
1. Check this README
2. Review the seed script code in `seed.ts`
3. Verify Prisma schema in `schema.prisma`
4. Check package.json scripts are configured correctly
