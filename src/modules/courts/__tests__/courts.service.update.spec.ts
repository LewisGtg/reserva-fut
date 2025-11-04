import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CourtsService } from '../courts.service';
import { PrismaService } from '../../../database/prisma.service';
import { UpdateCourtDto } from '../dto/update-court.dto';
import {
  mockCourtId,
  mockCourtResponse,
  mockUpdateCourtDto,
  createMockPrismaService,
} from './courts.mock';

describe('CourtsService - Update Operations', () => {
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

  it('should update a court successfully', async () => {
    const updatedCourt = {
      ...mockCourtResponse,
      name: mockUpdateCourtDto.name,
      hourlyPrice: mockUpdateCourtDto.hourlyPrice,
    };

    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.update.mockResolvedValue(updatedCourt);

    const result = await courtsService.update(mockCourtId, mockUpdateCourtDto);

    expect(mockPrismaService.court.findUnique).toHaveBeenCalledWith({
      where: { id: mockCourtId },
      include: {
        establishment: true,
        schedules: true,
      },
    });
    expect(mockPrismaService.court.update).toHaveBeenCalledWith({
      where: { id: mockCourtId },
      data: mockUpdateCourtDto,
      include: {
        establishment: true,
        schedules: true,
      },
    });
    expect(result).toEqual(updatedCourt);
    expect(result.name).toBe(mockUpdateCourtDto.name);
    expect(result.hourlyPrice).toBe(mockUpdateCourtDto.hourlyPrice);
  });

  it('should throw NotFoundException when updating non-existent court', async () => {
    mockPrismaService.court.findUnique.mockResolvedValue(null);

    await expect(
      courtsService.update('non-existent-id', mockUpdateCourtDto),
    ).rejects.toThrow(NotFoundException);
    await expect(
      courtsService.update('non-existent-id', mockUpdateCourtDto),
    ).rejects.toThrow('Court with ID non-existent-id not found');
  });

  it('should update only specific fields', async () => {
    const partialUpdate: UpdateCourtDto = {
      hourlyPrice: 75,
    };

    const updatedCourt = {
      ...mockCourtResponse,
      hourlyPrice: 75,
    };

    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.update.mockResolvedValue(updatedCourt);

    const result = await courtsService.update(mockCourtId, partialUpdate);

    expect(result.hourlyPrice).toBe(75);
    expect(result.name).toBe(mockCourtResponse.name);
    expect(result.type).toBe(mockCourtResponse.type);
  });

  it('should update court dimensions', async () => {
    const dimensionUpdate: UpdateCourtDto = {
      dimensions: '45x22',
    };

    const updatedCourt = {
      ...mockCourtResponse,
      dimensions: '45x22',
    };

    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.update.mockResolvedValue(updatedCourt);

    const result = await courtsService.update(mockCourtId, dimensionUpdate);

    expect(result.dimensions).toBe('45x22');
  });

  it('should update court description', async () => {
    const descriptionUpdate: UpdateCourtDto = {
      description: 'Newly renovated professional court',
    };

    const updatedCourt = {
      ...mockCourtResponse,
      description: 'Newly renovated professional court',
    };

    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.update.mockResolvedValue(updatedCourt);

    const result = await courtsService.update(mockCourtId, descriptionUpdate);

    expect(result.description).toBe('Newly renovated professional court');
  });

  it('should update court type', async () => {
    const typeUpdate: UpdateCourtDto = {
      type: 'Hybrid',
    };

    const updatedCourt = {
      ...mockCourtResponse,
      type: 'Hybrid',
    };

    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.update.mockResolvedValue(updatedCourt);

    const result = await courtsService.update(mockCourtId, typeUpdate);

    expect(result.type).toBe('Hybrid');
  });

  it('should update multiple fields at once', async () => {
    const multiUpdate: UpdateCourtDto = {
      name: 'Elite Championship Court',
      hourlyPrice: 100,
      description: 'Premium court with latest technology',
      type: 'Premium Synthetic',
    };

    const updatedCourt = {
      ...mockCourtResponse,
      ...multiUpdate,
    };

    mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);
    mockPrismaService.court.update.mockResolvedValue(updatedCourt);

    const result = await courtsService.update(mockCourtId, multiUpdate);

    expect(result.name).toBe('Elite Championship Court');
    expect(result.hourlyPrice).toBe(100);
    expect(result.description).toBe('Premium court with latest technology');
    expect(result.type).toBe('Premium Synthetic');
  });
});
