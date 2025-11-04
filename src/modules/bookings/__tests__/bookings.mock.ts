import { CreateBookingDto, BookingStatus } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

/**
 * Mock data factory for Booking testing
 * Following NestJS best practices for test data management
 */

export const mockBookingId = 'booking-123';
export const mockUserId = 'user-456';
export const mockScheduleId = 'schedule-789';
export const mockCourtId = 'court-001';
export const mockEstablishmentId = 'establishment-002';
export const mockDate = new Date('2025-01-01T00:00:00.000Z');
export const mockStartTime = new Date('2025-01-02T10:00:00.000Z');
export const mockEndTime = new Date('2025-01-02T11:00:00.000Z');

export const mockUser = {
  id: mockUserId,
  name: 'John Doe',
  email: 'john.doe@example.com',
};

export const mockEstablishment = {
  id: mockEstablishmentId,
  name: 'Test Establishment',
  address: '123 Test Street',
  latitude: 40.7128,
  longitude: -74.006,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockCourt = {
  id: mockCourtId,
  name: 'Court A',
  type: 'Synthetic',
  dimensions: '40x20',
  hourlyPrice: 50,
  description: 'Main court',
  establishmentId: mockEstablishmentId,
  createdAt: mockDate,
  updatedAt: mockDate,
  establishment: mockEstablishment,
};

export const mockSchedule = {
  id: mockScheduleId,
  startTime: mockStartTime,
  endTime: mockEndTime,
  price: 50,
  status: 'AVAILABLE',
  courtId: mockCourtId,
  createdAt: mockDate,
  updatedAt: mockDate,
  court: mockCourt,
};

export const mockReservedSchedule = {
  ...mockSchedule,
  status: 'RESERVED',
};

export const mockBookingResponse = {
  id: mockBookingId,
  status: BookingStatus.CONFIRMED,
  userId: mockUserId,
  scheduleId: mockScheduleId,
  createdAt: mockDate,
  updatedAt: mockDate,
  user: mockUser,
  schedule: mockSchedule,
};

export const mockCancelledBooking = {
  ...mockBookingResponse,
  status: BookingStatus.CANCELLED,
};

export const mockCreateBookingDto: CreateBookingDto = {
  userId: mockUserId,
  scheduleId: mockScheduleId,
  status: BookingStatus.CONFIRMED,
};

export const mockUpdateBookingDto: UpdateBookingDto = {
  status: BookingStatus.CANCELLED,
};

export const mockBookings = [
  mockBookingResponse,
  {
    id: 'booking-456',
    status: BookingStatus.CONFIRMED,
    userId: 'user-789',
    scheduleId: 'schedule-456',
    createdAt: mockDate,
    updatedAt: mockDate,
    user: {
      id: 'user-789',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    schedule: mockSchedule,
  },
];

/**
 * Factory function to create custom booking mock data
 */
export const createMockBooking = (
  overrides?: Partial<typeof mockBookingResponse>,
) => ({
  ...mockBookingResponse,
  ...overrides,
});

/**
 * Factory function to create custom CreateBookingDto
 */
export const createMockCreateBookingDto = (
  overrides?: Partial<CreateBookingDto>,
): CreateBookingDto => ({
  ...mockCreateBookingDto,
  ...overrides,
});

/**
 * Mock PrismaService for Booking operations
 */
export const createMockPrismaService = () => ({
  booking: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  schedule: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});
