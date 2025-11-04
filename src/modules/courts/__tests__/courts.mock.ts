import { CreateCourtDto } from '../dto/create-court.dto';
import { UpdateCourtDto } from '../dto/update-court.dto';

/**
 * Mock data factory for Court testing
 * Following NestJS best practices for test data management
 */

export const mockCourtId = 'court-123';
export const mockEstablishmentId = 'establishment-456';
export const mockDate = new Date('2025-01-01T00:00:00.000Z');

export const mockEstablishment = {
  id: mockEstablishmentId,
  name: 'Test Establishment',
  address: '123 Test Street',
  latitude: 40.7128,
  longitude: -74.006,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockSchedule = {
  id: 'schedule-789',
  startTime: new Date('2025-01-02T10:00:00.000Z'),
  endTime: new Date('2025-01-02T11:00:00.000Z'),
  price: 50,
  status: 'AVAILABLE',
  courtId: mockCourtId,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockCourtResponse = {
  id: mockCourtId,
  name: 'Championship Court',
  type: 'Synthetic',
  dimensions: '40x20',
  hourlyPrice: 50,
  description: 'Professional grade synthetic turf court',
  establishmentId: mockEstablishmentId,
  createdAt: mockDate,
  updatedAt: mockDate,
  establishment: mockEstablishment,
  schedules: [mockSchedule],
};

export const mockCreateCourtDto: CreateCourtDto = {
  name: 'Championship Court',
  type: 'Synthetic',
  dimensions: '40x20',
  hourlyPrice: 50,
  description: 'Professional grade synthetic turf court',
  establishmentId: mockEstablishmentId,
};

export const mockUpdateCourtDto: UpdateCourtDto = {
  name: 'Updated Championship Court',
  hourlyPrice: 60,
};

export const mockCourtWithoutOptionalFields = {
  id: 'court-456',
  name: 'Basic Court',
  type: 'Grass',
  dimensions: null,
  hourlyPrice: 30,
  description: null,
  establishmentId: mockEstablishmentId,
  createdAt: mockDate,
  updatedAt: mockDate,
  establishment: mockEstablishment,
  schedules: [],
};

export const mockCourts = [
  mockCourtResponse,
  mockCourtWithoutOptionalFields,
  {
    id: 'court-789',
    name: 'Indoor Court',
    type: 'Indoor',
    dimensions: '35x18',
    hourlyPrice: 70,
    description: 'Climate-controlled indoor court',
    establishmentId: mockEstablishmentId,
    createdAt: mockDate,
    updatedAt: mockDate,
    establishment: mockEstablishment,
    schedules: [],
  },
];

/**
 * Factory function to create custom court mock data
 */
export const createMockCourt = (
  overrides?: Partial<typeof mockCourtResponse>,
) => ({
  ...mockCourtResponse,
  ...overrides,
});

/**
 * Factory function to create custom CreateCourtDto
 */
export const createMockCreateCourtDto = (
  overrides?: Partial<CreateCourtDto>,
): CreateCourtDto => ({
  ...mockCreateCourtDto,
  ...overrides,
});

/**
 * Mock PrismaService for Court operations
 */
export const createMockPrismaService = () => ({
  court: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});
