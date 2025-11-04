import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { PrismaService } from '../../../database/prisma.service';
import {
  mockUserId,
  mockUserResponse,
  createMockPrismaService,
} from './users.mock';

describe('UsersService - Delete Operations', () => {
  let service: UsersService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should delete a user by id', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(mockUserResponse);
    mockPrismaService.user.delete.mockResolvedValue(mockUserResponse);

    const result = await service.remove(mockUserId);

    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
      where: { id: mockUserId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    expect(result).toEqual(mockUserResponse);
  });

  it('should throw NotFoundException when deleting non-existent user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    await expect(service.remove('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.remove('non-existent-id')).rejects.toThrow(
      'User with ID non-existent-id not found',
    );
  });
});
