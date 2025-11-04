import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EstablishmentsService } from '../establishments.service';
import { PrismaService } from '../../../database/prisma.service';
import {
  mockEstablishmentId,
  mockEstablishmentResponse,
  mockCreateEstablishmentDto,
  mockEstablishments,
  mockEstablishmentWithoutOptionalFields,
  mockManagerId,
  mockEstablishmentManager,
  createMockPrismaService,
} from './establishments.mock';

describe('EstablishmentsService', () => {
  let service: EstablishmentsService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = moduleRef.get<EstablishmentsService>(EstablishmentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new establishment with all fields', async () => {
      mockPrismaService.establishment.create.mockResolvedValue(
        mockEstablishmentResponse,
      );

      const result = await service.create(mockCreateEstablishmentDto);

      expect(mockPrismaService.establishment.create).toHaveBeenCalledWith({
        data: mockCreateEstablishmentDto,
        include: {
          courts: true,
          managers: {
            include: {
              manager: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockEstablishmentResponse);
      expect(result.courts).toBeDefined();
      expect(result.managers).toBeDefined();
    });

    it('should create establishment without optional fields', async () => {
      const minimalDto = {
        name: 'Basic Sports Center',
        address: '789 Simple Street',
      };

      mockPrismaService.establishment.create.mockResolvedValue(
        mockEstablishmentWithoutOptionalFields,
      );

      const result = await service.create(minimalDto);

      expect(result).toEqual(mockEstablishmentWithoutOptionalFields);
      expect(result.latitude).toBeNull();
      expect(result.longitude).toBeNull();
    });

    it('should create establishment with coordinates', async () => {
      mockPrismaService.establishment.create.mockResolvedValue(
        mockEstablishmentResponse,
      );

      const result = await service.create(mockCreateEstablishmentDto);

      expect(result.latitude).toBe(40.7128);
      expect(result.longitude).toBe(-74.006);
    });
  });

  describe('findAll', () => {
    it('should return an array of establishments', async () => {
      mockPrismaService.establishment.findMany.mockResolvedValue(
        mockEstablishments,
      );

      const result = await service.findAll();

      expect(mockPrismaService.establishment.findMany).toHaveBeenCalledWith({
        include: {
          courts: true,
          managers: {
            include: {
              manager: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockEstablishments);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no establishments exist', async () => {
      mockPrismaService.establishment.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return an establishment by id', async () => {
      mockPrismaService.establishment.findUnique.mockResolvedValue(
        mockEstablishmentResponse,
      );

      const result = await service.findOne(mockEstablishmentId);

      expect(mockPrismaService.establishment.findUnique).toHaveBeenCalledWith({
        where: { id: mockEstablishmentId },
        include: {
          courts: true,
          managers: {
            include: {
              manager: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockEstablishmentResponse);
    });

    it('should throw NotFoundException when establishment does not exist', async () => {
      mockPrismaService.establishment.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Establishment with ID non-existent-id not found',
      );
    });
  });

  describe('addManager', () => {
    it('should add a manager to an establishment', async () => {
      const relationWithEstablishment = {
        ...mockEstablishmentManager,
        establishment: mockEstablishmentResponse,
      };

      mockPrismaService.establishment.findUnique.mockResolvedValue(
        mockEstablishmentResponse,
      );
      mockPrismaService.establishmentManager.create.mockResolvedValue(
        relationWithEstablishment,
      );

      const result = await service.addManager(
        mockEstablishmentId,
        mockManagerId,
      );

      expect(
        mockPrismaService.establishmentManager.create,
      ).toHaveBeenCalledWith({
        data: {
          establishmentId: mockEstablishmentId,
          managerId: mockManagerId,
        },
        include: {
          establishment: true,
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(relationWithEstablishment);
    });

    it('should throw NotFoundException when establishment does not exist', async () => {
      mockPrismaService.establishment.findUnique.mockResolvedValue(null);

      await expect(
        service.addManager('non-existent-id', mockManagerId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeManager', () => {
    it('should remove a manager from an establishment', async () => {
      mockPrismaService.establishmentManager.findFirst.mockResolvedValue(
        mockEstablishmentManager,
      );
      mockPrismaService.establishmentManager.delete.mockResolvedValue(
        mockEstablishmentManager,
      );

      const result = await service.removeManager(
        mockEstablishmentId,
        mockManagerId,
      );

      expect(
        mockPrismaService.establishmentManager.findFirst,
      ).toHaveBeenCalledWith({
        where: {
          establishmentId: mockEstablishmentId,
          managerId: mockManagerId,
        },
      });
      expect(
        mockPrismaService.establishmentManager.delete,
      ).toHaveBeenCalledWith({
        where: { id: mockEstablishmentManager.id },
      });
      expect(result).toEqual(mockEstablishmentManager);
    });

    it('should throw NotFoundException when relationship does not exist', async () => {
      mockPrismaService.establishmentManager.findFirst.mockResolvedValue(null);

      await expect(
        service.removeManager(mockEstablishmentId, mockManagerId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.removeManager(mockEstablishmentId, mockManagerId),
      ).rejects.toThrow('Manager relationship not found');
    });
  });
});
