import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { PrismaService } from '../../../database/prisma.service';
import { UserRole } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  mockUserId,
  mockUserResponse,
  mockCreateUserDto,
  mockUsers,
  createMockPrismaService,
} from './users.mock';

// Mock bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
  let usersService: UsersService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);

    // Reset mocks before each test
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password_123');
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      mockPrismaService.user.create.mockResolvedValue(mockUserResponse);

      const result = await usersService.create(mockCreateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateUserDto.name,
          email: mockCreateUserDto.email,
          role: mockCreateUserDto.role,
          verified: mockCreateUserDto.verified,
          passwordHash: 'hashed_password_123',
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
      expect(result).toEqual(mockUserResponse);
    });

    it('should create user without verified field', async () => {
      const createDto = { ...mockCreateUserDto };
      delete createDto.verified;

      mockPrismaService.user.create.mockResolvedValue(mockUserResponse);

      const result = await usersService.create(createDto);

      expect(result).toEqual(mockUserResponse);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should create a manager user', async () => {
      const managerResponse = {
        ...mockUserResponse,
        role: UserRole.MANAGER,
      };

      mockPrismaService.user.create.mockResolvedValue(managerResponse);

      const result = await usersService.create({
        ...mockCreateUserDto,
        role: UserRole.MANAGER,
      });

      expect(result.role).toBe(UserRole.MANAGER);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await usersService.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await usersService.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserResponse);

      const result = await usersService.findOne(mockUserId);

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
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(usersService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(usersService.findOne('non-existent-id')).rejects.toThrow(
        'User with ID non-existent-id not found',
      );
    });
  });
});
