import { CreateScheduleDto, ScheduleStatus } from '../dto/create-schedule.dto';
import { UpdateScheduleDto } from '../dto/update-schedule.dto';

/**
 * Mock data factory for Schedule testing
 * Following NestJS best practices for test data management
 */

export const mockScheduleId = 'schedule-123';
export const mockCourtId = 'court-456';
export const mockEstablishmentId = 'establishment-789';
export const mockDate = new Date('2025-01-01T00:00:00.000Z');
export const mockStartTime = new Date('2025-01-02T10:00:00.000Z');
export const mockEndTime = new Date('2025-01-02T11:00:00.000Z');

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

export const mockBooking = {
  id: 'booking-001',
  status: 'CONFIRMED',
  userId: 'user-123',
  scheduleId: mockScheduleId,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockScheduleResponse = {
  id: mockScheduleId,
  startTime: mockStartTime,
  endTime: mockEndTime,
  price: 50,
  status: ScheduleStatus.AVAILABLE,
  courtId: mockCourtId,
  createdAt: mockDate,
  updatedAt: mockDate,
  court: mockCourt,
  booking: null,
};

export const mockReservedSchedule = {
  ...mockScheduleResponse,
  id: 'schedule-456',
  status: ScheduleStatus.RESERVED,
  booking: mockBooking,
};

export const mockCreateScheduleDto: CreateScheduleDto = {
  startTime: '2025-01-02T10:00:00.000Z',
  endTime: '2025-01-02T11:00:00.000Z',
  price: 50,
  status: ScheduleStatus.AVAILABLE,
  courtId: mockCourtId,
};

export const mockUpdateScheduleDto: UpdateScheduleDto = {
  price: 60,
  status: ScheduleStatus.RESERVED,
};

export const mockSchedules = [
  mockScheduleResponse,
  mockReservedSchedule,
  {
    id: 'schedule-789',
    startTime: new Date('2025-01-02T14:00:00.000Z'),
    endTime: new Date('2025-01-02T15:00:00.000Z'),
    price: 45,
    status: ScheduleStatus.AVAILABLE,
    courtId: mockCourtId,
    createdAt: mockDate,
    updatedAt: mockDate,
    court: mockCourt,
    booking: null,
  },
];

/**
 * Factory function to create custom schedule mock data
 */
export const createMockSchedule = (
  overrides?: Partial<typeof mockScheduleResponse>,
) => ({
  ...mockScheduleResponse,
  ...overrides,
});

/**
 * Factory function to create custom CreateScheduleDto
 */
export const createMockCreateScheduleDto = (
  overrides?: Partial<CreateScheduleDto>,
): CreateScheduleDto => ({
  ...mockCreateScheduleDto,
  ...overrides,
});

/**
 * Mock PrismaService for Schedule operations
 */
export const createMockPrismaService = () => ({
  schedule: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});
