import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CourtsService } from '../courts.service';
import { PrismaService } from '../../../database/prisma.service';
import {
  mockCourtId,
  mockCourtResponse,
  createMockPrismaService,
} from './courts.mock';

describe('CourtsService - Delete Operations', () => {
  let courtsService: CourtsService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CourtsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    courtsService = moduleRef.get<CourtsService>(CourtsService);
    jest.clearAllMocks();
  });

  it('should delete a court by id', async () => {
    const deletedCourt = {
      id: mockCourtId,
      name: mockCourtResponse.name,
      type: mockCourtResponse.type,
      dimensions: mockCourtResponse.dimensions,
      hourlyPrice: mockCourtResponse.hourlyPrice,
      description: mockCourtResponse.description,
      establishmentId: mockCourtResponse.establishmentId,
      createdAt: mockCourtResponse.createdAt,
      updatedAt: mockCourtResponse.updatedAt,
    };

    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.delete.mockResolvedValue(deletedCourt);

    const result = await courtsService.remove(mockCourtId);

    expect(mockPrismaService.court.findUnique).toHaveBeenCalledWith({
      where: { id: mockCourtId },
      include: {
        establishment: true,
        schedules: true,
      },
    });
    expect(mockPrismaService.court.delete).toHaveBeenCalledWith({
      where: { id: mockCourtId },
    });
    expect(result).toEqual(deletedCourt);
  });

  it('should throw NotFoundException when deleting non-existent court', async () => {
    mockPrismaService.court.findUnique.mockResolvedValue(null);

    await expect(courtsService.remove('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
    await expect(courtsService.remove('non-existent-id')).rejects.toThrow(
      'Court with ID non-existent-id not found',
    );
  });

  it('should verify court exists before deleting', async () => {
    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.delete.mockResolvedValue(mockCourtResponse);

    await courtsService.remove(mockCourtId);

    // Both findUnique and delete should be called
    expect(mockPrismaService.court.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaService.court.delete).toHaveBeenCalledTimes(1);
  });
});
