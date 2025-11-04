import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CourtsService } from '../courts.service';
import { PrismaService } from '../../../database/prisma.service';
import {
  mockCourtId,
  mockCourtResponse,
  mockCreateCourtDto,
  mockCourts,
  mockEstablishmentId,
  mockCourtWithoutOptionalFields,
  createMockPrismaService,
} from './courts.mock';

describe('CourtsService', () => {
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

  it('should be defined', () => {
    expect(courtsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new court with all fields', async () => {
      mockPrismaService.court.create.mockResolvedValue(mockCourtResponse);

      const result = await courtsService.create(mockCreateCourtDto);

      expect(mockPrismaService.court.create).toHaveBeenCalledWith({
        data: mockCreateCourtDto,
        include: {
          establishment: true,
          schedules: true,
        },
      });
      expect(result).toEqual(mockCourtResponse);
      expect(result.establishment).toBeDefined();
      expect(result.schedules).toBeDefined();
    });

    it('should create court without optional fields', async () => {
      const minimalDto = {
        name: 'Basic Court',
        type: 'Grass',
        hourlyPrice: 30,
        establishmentId: mockEstablishmentId,
      };

      mockPrismaService.court.create.mockResolvedValue(
        mockCourtWithoutOptionalFields,
      );

      const result = await courtsService.create(minimalDto);

      expect(result).toEqual(mockCourtWithoutOptionalFields);
      expect(result.dimensions).toBeNull();
      expect(result.description).toBeNull();
    });

    it('should create court with different types', async () => {
      const indoorCourt = {
        ...mockCourtResponse,
        type: 'Indoor',
        name: 'Indoor Court',
      };

      mockPrismaService.court.create.mockResolvedValue(indoorCourt);

      const result = await courtsService.create({
        ...mockCreateCourtDto,
        type: 'Indoor',
        name: 'Indoor Court',
      });

      expect(result.type).toBe('Indoor');
      expect(result.name).toBe('Indoor Court');
    });
  });

  describe('findAll', () => {
    it('should return an array of courts', async () => {
      mockPrismaService.court.findMany.mockResolvedValue(mockCourts);

      const result = await courtsService.findAll();

      expect(mockPrismaService.court.findMany).toHaveBeenCalledWith({
        include: {
          establishment: true,
          schedules: true,
        },
      });
      expect(result).toEqual(mockCourts);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no courts exist', async () => {
      mockPrismaService.court.findMany.mockResolvedValue([]);

      const result = await courtsService.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should include establishment and schedules in results', async () => {
      mockPrismaService.court.findMany.mockResolvedValue([mockCourtResponse]);

      const result = await courtsService.findAll();

      expect(result[0].establishment).toBeDefined();
      expect(result[0].schedules).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a court by id', async () => {
      mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);

      const result = await courtsService.findOne(mockCourtId);

      expect(mockPrismaService.court.findUnique).toHaveBeenCalledWith({
        where: { id: mockCourtId },
        include: {
          establishment: true,
          schedules: true,
        },
      });
      expect(result).toEqual(mockCourtResponse);
    });

    it('should throw NotFoundException when court does not exist', async () => {
      mockPrismaService.court.findUnique.mockResolvedValue(null);

      await expect(courtsService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(courtsService.findOne('non-existent-id')).rejects.toThrow(
        'Court with ID non-existent-id not found',
      );
    });

    it('should include establishment and schedules', async () => {
      mockPrismaService.court.findUnique.mockResolvedValue(mockCourtResponse);

      const result = await courtsService.findOne(mockCourtId);

      expect(result.establishment).toBeDefined();
      expect(result.schedules).toBeDefined();
      expect(result.establishment.id).toBe(mockEstablishmentId);
    });
  });

  describe('findByEstablishment', () => {
    it('should return courts for a specific establishment', async () => {
      mockPrismaService.court.findMany.mockResolvedValue(mockCourts);

      const result =
        await courtsService.findByEstablishment(mockEstablishmentId);

      expect(mockPrismaService.court.findMany).toHaveBeenCalledWith({
        where: { establishmentId: mockEstablishmentId },
        include: {
          schedules: true,
        },
      });
      expect(result).toEqual(mockCourts);
    });

    it('should return empty array when establishment has no courts', async () => {
      mockPrismaService.court.findMany.mockResolvedValue([]);

      const result = await courtsService.findByEstablishment('empty-est-id');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should include schedules but not establishment in results', async () => {
      mockPrismaService.court.findMany.mockResolvedValue([mockCourtResponse]);

      await courtsService.findByEstablishment(mockEstablishmentId);

      expect(mockPrismaService.court.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            schedules: true,
          },
        }),
      );
      // Verify establishment is not included in the query
      expect(mockPrismaService.court.findMany).not.toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            establishment: true,
          },
        }),
      );
    });
  });
});
