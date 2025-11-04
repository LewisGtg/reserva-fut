import { CreateUserDto, UserRole } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * Mock data factory for User testing
 */

export const mockUserId = 'user-123';
export const mockDate = new Date('2025-01-01T00:00:00.000Z');

export const mockUserResponse = {
  id: mockUserId,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: UserRole.PLAYER,
  verified: false,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockUserWithPassword = {
  ...mockUserResponse,
  passwordHash: 'hashed_password_123',
};

export const mockCreateUserDto: CreateUserDto = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  role: UserRole.PLAYER,
  verified: false,
};

export const mockUpdateUserDto: UpdateUserDto = {
  name: 'John Doe Updated',
  email: 'john.updated@example.com',
};

export const mockManagerUser = {
  id: 'user-456',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  role: UserRole.MANAGER,
  verified: true,
  createdAt: mockDate,
  updatedAt: mockDate,
};

export const mockUsers = [mockUserResponse, mockManagerUser];

/**
 * Factory function to create custom user mock data
 */
export const createMockUser = (
  overrides?: Partial<typeof mockUserResponse>,
) => ({
  ...mockUserResponse,
  ...overrides,
});

/**
 * Factory function to create custom CreateUserDto
 */
export const createMockCreateUserDto = (
  overrides?: Partial<CreateUserDto>,
): CreateUserDto => ({
  ...mockCreateUserDto,
  ...overrides,
});

/**
 * Mock PrismaService for User operations
 */
export const createMockPrismaService = () => ({
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});
