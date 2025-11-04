import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EstablishmentsService } from '../establishments.service';
import { PrismaService } from '../../../database/prisma.service';
import { UpdateEstablishmentDto } from '../dto/update-establishment.dto';
import {
  mockEstablishmentId,
  mockEstablishmentResponse,
  mockUpdateEstablishmentDto,
  createMockPrismaService,
} from './establishments.mock';

describe('EstablishmentsService - Update & Delete Operations', () => {
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

  describe('update', () => {
    it('should update an establishment successfully', async () => {
      const updatedEstablishment = {
        ...mockEstablishmentResponse,
        name: mockUpdateEstablishmentDto.name,
        address: mockUpdateEstablishmentDto.address,
      };

      mockPrismaService.establishment.findUnique.mockResolvedValue(
        mockEstablishmentResponse,
      );
      mockPrismaService.establishment.update.mockResolvedValue(
        updatedEstablishment,
      );

      const result = await service.update(
        mockEstablishmentId,
        mockUpdateEstablishmentDto,
      );

      expect(mockPrismaService.establishment.update).toHaveBeenCalledWith({
        where: { id: mockEstablishmentId },
        data: mockUpdateEstablishmentDto,
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
      expect(result.name).toBe(mockUpdateEstablishmentDto.name);
      expect(result.address).toBe(mockUpdateEstablishmentDto.address);
    });

    it('should update only specific fields', async () => {
      const partialUpdate: UpdateEstablishmentDto = {
        name: 'New Name Only',
      };

      const updatedEstablishment = {
        ...mockEstablishmentResponse,
        name: 'New Name Only',
      };

      mockPrismaService.establishment.findUnique.mockResolvedValue(
        mockEstablishmentResponse,
      );
      mockPrismaService.establishment.update.mockResolvedValue(
        updatedEstablishment,
      );

      const result = await service.update(mockEstablishmentId, partialUpdate);

      expect(result.name).toBe('New Name Only');
      expect(result.address).toBe(mockEstablishmentResponse.address);
    });

    it('should update coordinates', async () => {
      const coordinatesUpdate: UpdateEstablishmentDto = {
        latitude: 34.0522,
        longitude: -118.2437,
      };

      const updatedEstablishment = {
        ...mockEstablishmentResponse,
        latitude: 34.0522,
        longitude: -118.2437,
      };

      mockPrismaService.establishment.findUnique.mockResolvedValue(
        mockEstablishmentResponse,
      );
      mockPrismaService.establishment.update.mockResolvedValue(
        updatedEstablishment,
      );

      const result = await service.update(
        mockEstablishmentId,
        coordinatesUpdate,
      );

      expect(result.latitude).toBe(34.0522);
      expect(result.longitude).toBe(-118.2437);
    });

    it('should throw NotFoundException when updating non-existent establishment', async () => {
      mockPrismaService.establishment.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', mockUpdateEstablishmentDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an establishment by id', async () => {
      const deletedEstablishment = {
        id: mockEstablishmentId,
        name: mockEstablishmentResponse.name,
        address: mockEstablishmentResponse.address,
        latitude: mockEstablishmentResponse.latitude,
        longitude: mockEstablishmentResponse.longitude,
        createdAt: mockEstablishmentResponse.createdAt,
        updatedAt: mockEstablishmentResponse.updatedAt,
      };

      mockPrismaService.establishment.findUnique.mockResolvedValue(
        mockEstablishmentResponse,
      );
      mockPrismaService.establishment.delete.mockResolvedValue(
        deletedEstablishment,
      );

      const result = await service.remove(mockEstablishmentId);

      expect(mockPrismaService.establishment.delete).toHaveBeenCalledWith({
        where: { id: mockEstablishmentId },
      });
      expect(result).toEqual(deletedEstablishment);
    });

    it('should throw NotFoundException when deleting non-existent establishment', async () => {
      mockPrismaService.establishment.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
