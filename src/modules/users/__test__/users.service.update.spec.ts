import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { PrismaService } from '../../../database/prisma.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import {
  mockUserId,
  mockUserResponse,
  mockUpdateUserDto,
  createMockPrismaService,
} from './users.mock';

jest.mock('bcrypt');

describe('UsersService - Update Operations', () => {
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
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password_123');
  });

  it('should update a user without password', async () => {
    const updatedUser = {
      ...mockUserResponse,
      name: mockUpdateUserDto.name,
      email: mockUpdateUserDto.email,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(mockUserResponse);
    mockPrismaService.user.update.mockResolvedValue(updatedUser);

    const result = await service.update(mockUserId, mockUpdateUserDto);

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: mockUserId },
      data: mockUpdateUserDto,
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
    expect(result).toEqual(updatedUser);
  });

  it('should update a user with password hashing', async () => {
    const updateDtoWithPassword: UpdateUserDto = {
      ...mockUpdateUserDto,
      password: 'newPassword123',
    };

    mockPrismaService.user.findUnique.mockResolvedValue(mockUserResponse);
    mockPrismaService.user.update.mockResolvedValue(mockUserResponse);

    await service.update(mockUserId, updateDtoWithPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: mockUserId },
      data: {
        name: mockUpdateUserDto.name,
        email: mockUpdateUserDto.email,
        password: 'hashed_password_123',
      },
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
  });

  it('should throw NotFoundException when updating non-existent user', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      service.update('non-existent-id', mockUpdateUserDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update only specific fields', async () => {
    const partialUpdate: UpdateUserDto = {
      name: 'Updated Name Only',
    };

    const updatedUser = {
      ...mockUserResponse,
      name: 'Updated Name Only',
    };

    mockPrismaService.user.findUnique.mockResolvedValue(mockUserResponse);
    mockPrismaService.user.update.mockResolvedValue(updatedUser);

    const result = await service.update(mockUserId, partialUpdate);

    expect(result.name).toBe('Updated Name Only');
    expect(result.email).toBe(mockUserResponse.email);
  });

  it('should handle updating to verified status', async () => {
    const verifyUpdate: UpdateUserDto = {
      verified: true,
    };

    const verifiedUser = {
      ...mockUserResponse,
      verified: true,
    };

    mockPrismaService.user.findUnique.mockResolvedValue(mockUserResponse);
    mockPrismaService.user.update.mockResolvedValue(verifiedUser);

    const result = await service.update(mockUserId, verifyUpdate);

    expect(result.verified).toBe(true);
  });
});
