import { CreateEstablishmentDto } from '../dto/create-establishment.dto';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';

/**
 * Mock data factory for Establishment testing
 * Following NestJS best practices for test data management
 */

export const mockEstablishmentId = 'establishment-123';
export const mockManagerId = 'manager-456';
export const mockDate = new Date('2025-01-01T00:00:00.000Z');

export const mockManager = {
  id: mockManagerId,
  name: 'John Manager',
  email: 'manager@example.com',
};

export const mockCourt = {
  id: 'court-789',
  name: 'Court A',
  type: 'Synthetic',
  dimensions: '40x20',
  hourlyPrice: 50,
  description: 'Main court',
  establishmentId: mockEstablishmentId,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockEstablishmentManager = {
  id: 'est-manager-001',
  establishmentId: mockEstablishmentId,
  managerId: mockManagerId,
  createdAt: mockDate,
  updatedAt: mockDate,
  manager: mockManager,
};

export const mockEstablishmentResponse = {
  id: mockEstablishmentId,
  name: 'Premium Sports Center',
  address: '123 Main Street, City',
  latitude: 40.7128,
  longitude: -74.006,
  createdAt: mockDate,
  updatedAt: mockDate,
  courts: [mockCourt],
  managers: [mockEstablishmentManager],
};

export const mockCreateEstablishmentDto: CreateEstablishmentDto = {
  name: 'Premium Sports Center',
  address: '123 Main Street, City',
  latitude: 40.7128,
  longitude: -74.006,
};

export const mockUpdateEstablishmentDto: UpdateEstablishmentDto = {
  name: 'Updated Sports Center',
  address: '456 New Street, City',
};

export const mockEstablishmentWithoutOptionalFields = {
  id: 'establishment-456',
  name: 'Basic Sports Center',
  address: '789 Simple Street',
  latitude: null,
  longitude: null,
  createdAt: mockDate,
  updatedAt: mockDate,
  courts: [],
  managers: [],
};

export const mockEstablishments = [
  mockEstablishmentResponse,
  mockEstablishmentWithoutOptionalFields,
  {
    id: 'establishment-789',
    name: 'Elite Training Center',
    address: '999 Elite Avenue',
    latitude: 34.0522,
    longitude: -118.2437,
    createdAt: mockDate,
    updatedAt: mockDate,
    courts: [],
    managers: [],
  },
];

/**
 * Factory function to create custom establishment mock data
 */
export const createMockEstablishment = (
  overrides?: Partial<typeof mockEstablishmentResponse>,
) => ({
  ...mockEstablishmentResponse,
  ...overrides,
});

/**
 * Factory function to create custom CreateEstablishmentDto
 */
export const createMockCreateEstablishmentDto = (
  overrides?: Partial<CreateEstablishmentDto>,
): CreateEstablishmentDto => ({
  ...mockCreateEstablishmentDto,
  ...overrides,
});

/**
 * Mock PrismaService for Establishment operations
 */
export const createMockPrismaService = () => ({
  establishment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  establishmentManager: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
});
