import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const MAX_HOUR = 22;
const MIN_HOUR = 8;

/**
 * Seed data for Users
 */
async function seedUsers() {
  console.log('🌱 Seeding users...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Player',
        email: 'player1@example.com',
        passwordHash,
        role: 'PLAYER',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Player',
        email: 'player2@example.com',
        passwordHash,
        role: 'PLAYER',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Bob Manager',
        email: 'manager1@example.com',
        passwordHash,
        role: 'MANAGER',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alice Manager',
        email: 'manager2@example.com',
        passwordHash,
        role: 'MANAGER',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Charlie Player',
        email: 'player3@example.com',
        passwordHash,
        role: 'PLAYER',
        verified: false,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);
  return users;
}

/**
 * Seed data for Establishments
 */
async function seedEstablishments(managers: any[]) {
  console.log('🌱 Seeding establishments...');

  const establishments = await Promise.all([
    prisma.establishment.create({
      data: {
        name: 'Premium Sports Center',
        address: '123 Main Street, New York, NY 10001',
        latitude: 40.7128,
        longitude: -74.006,
        managers: {
          create: [
            {
              managerId: managers[0].id, // Bob Manager
            },
          ],
        },
      },
    }),
    prisma.establishment.create({
      data: {
        name: 'Elite Training Facility',
        address: '456 Sports Avenue, Los Angeles, CA 90001',
        latitude: 34.0522,
        longitude: -118.2437,
        managers: {
          create: [
            {
              managerId: managers[1].id, // Alice Manager
            },
          ],
        },
      },
    }),
    prisma.establishment.create({
      data: {
        name: 'City Soccer Complex',
        address: '789 Stadium Road, Chicago, IL 60601',
        latitude: 41.8781,
        longitude: -87.6298,
        managers: {
          create: [
            {
              managerId: managers[0].id, // Bob Manager
            },
            {
              managerId: managers[1].id, // Alice Manager
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${establishments.length} establishments`);
  return establishments;
}

/**
 * Seed data for Courts
 */
async function seedCourts(establishments: any[]) {
  console.log('🌱 Seeding courts...');

  const courts = await Promise.all([
    // Premium Sports Center - 3 courts
    prisma.court.create({
      data: {
        name: 'Court A - Synthetic',
        type: 'Synthetic',
        dimensions: '40x20',
        hourlyPrice: 50,
        description: 'Professional grade synthetic turf court',
        establishmentId: establishments[0].id,
      },
    }),
    prisma.court.create({
      data: {
        name: 'Court B - Grass',
        type: 'Grass',
        dimensions: '45x22',
        hourlyPrice: 60,
        description: 'Natural grass court with excellent drainage',
        establishmentId: establishments[0].id,
      },
    }),
    prisma.court.create({
      data: {
        name: 'Court C - Indoor',
        type: 'Indoor',
        dimensions: '35x18',
        hourlyPrice: 70,
        description: 'Climate-controlled indoor court',
        establishmentId: establishments[0].id,
      },
    }),

    // Elite Training Facility - 2 courts
    prisma.court.create({
      data: {
        name: 'Championship Court',
        type: 'Hybrid',
        dimensions: '50x25',
        hourlyPrice: 80,
        description: 'Tournament-quality hybrid surface',
        establishmentId: establishments[1].id,
      },
    }),
    prisma.court.create({
      data: {
        name: 'Training Court',
        type: 'Synthetic',
        dimensions: '40x20',
        hourlyPrice: 55,
        description: 'Ideal for training sessions',
        establishmentId: establishments[1].id,
      },
    }),

    // City Soccer Complex - 4 courts
    prisma.court.create({
      data: {
        name: 'Main Stadium Court',
        type: 'Grass',
        dimensions: '50x30',
        hourlyPrice: 100,
        description: 'Full-size stadium court',
        establishmentId: establishments[2].id,
      },
    }),
    prisma.court.create({
      data: {
        name: 'Practice Field 1',
        type: 'Synthetic',
        dimensions: '40x20',
        hourlyPrice: 45,
        establishmentId: establishments[2].id,
      },
    }),
    prisma.court.create({
      data: {
        name: 'Practice Field 2',
        type: 'Synthetic',
        dimensions: '40x20',
        hourlyPrice: 45,
        establishmentId: establishments[2].id,
      },
    }),
    prisma.court.create({
      data: {
        name: 'Small Court',
        type: 'Concrete',
        dimensions: '30x15',
        hourlyPrice: 30,
        description: 'Budget-friendly option for casual games',
        establishmentId: establishments[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${courts.length} courts`);
  return courts;
}

/**
 * Seed data for Schedules
 */
async function seedSchedules(courts: any[]) {
  console.log('🌱 Seeding schedules...');

  const schedules = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create schedules for the next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);

    // For each court, create time slots from 8 AM to 10 PM (14 slots of 1 hour each)
    for (const court of courts) {
      for (let hour = MIN_HOUR; hour < MAX_HOUR; hour++) {
        const startTime = new Date(currentDate);
        startTime.setHours(hour, 0, 0, 0);

        const endTime = new Date(currentDate);
        endTime.setHours(hour + 1, 0, 0, 0);

        // Make some schedules reserved for realism
        const isReserved = Math.random() < 0.3; // 30% chance of being reserved

        const schedule = await prisma.schedule.create({
          data: {
            startTime,
            endTime,
            price: court.hourlyPrice,
            status: isReserved ? 'RESERVED' : 'AVAILABLE',
            courtId: court.id,
          },
        });

        schedules.push(schedule);
      }
    }
  }

  console.log(`✅ Created ${schedules.length} schedules`);
  return schedules;
}

/**
 * Seed data for Bookings
 */
async function seedBookings(users: any[], schedules: any[]) {
  console.log('🌱 Seeding bookings...');

  const players = users.filter((user) => user.role === 'PLAYER');
  const reservedSchedules = schedules.filter(
    (schedule) => schedule.status === 'RESERVED',
  );

  const bookings = [];

  // Create bookings for reserved schedules
  for (let i = 0; i < Math.min(reservedSchedules.length, 20); i++) {
    const schedule = reservedSchedules[i];
    const player = players[i % players.length];

    const booking = await prisma.booking.create({
      data: {
        status: 'CONFIRMED',
        userId: player.id,
        scheduleId: schedule.id,
      },
    });

    bookings.push(booking);
  }

  // Create some cancelled bookings
  const cancelledCount = Math.min(
    5,
    reservedSchedules.length - bookings.length,
  );
  for (let i = 0; i < cancelledCount; i++) {
    const scheduleIndex = bookings.length + i;
    const scheduleForCancelled = reservedSchedules[scheduleIndex];
    const player = players[i % players.length];

    await prisma.booking.create({
      data: {
        status: 'CANCELLED',
        userId: player.id,
        scheduleId: scheduleForCancelled.id,
      },
    });

    // Update schedule status back to AVAILABLE for cancelled bookings
    await prisma.schedule.update({
      where: { id: scheduleForCancelled.id },
      data: { status: 'AVAILABLE' },
    });
  }

  console.log(`✅ Created ${bookings.length} bookings`);
  return bookings;
}

/**
 * Main seed function
 */
async function main() {
  console.log('🚀 Starting database seed...\n');

  try {
    // Clear existing data (optional - comment out if you want to preserve data)
    console.log('🧹 Cleaning existing data...');
    await prisma.booking.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.court.deleteMany();
    await prisma.establishmentManager.deleteMany();
    await prisma.establishment.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleared\n');

    // Seed in order (respecting foreign key constraints)
    const users = await seedUsers();
    const managers = users.filter((user) => user.role === 'MANAGER');
    const establishments = await seedEstablishments(managers);
    const courts = await seedCourts(establishments);
    const schedules = await seedSchedules(courts);
    await seedBookings(users, schedules);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Establishments: ${establishments.length}`);
    console.log(`   Courts: ${courts.length}`);
    console.log(`   Schedules: ${schedules.length}`);
    console.log(
      `   Bookings: ${await prisma.booking.count()} (${await prisma.booking.count({ where: { status: 'CONFIRMED' } })} confirmed, ${await prisma.booking.count({ where: { status: 'CANCELLED' } })} cancelled)`,
    );
    console.log('\n🔑 Test credentials:');
    console.log('   Email: player1@example.com');
    console.log('   Password: password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Execute main function
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
