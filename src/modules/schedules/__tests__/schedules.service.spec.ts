import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SchedulesService } from '../schedules.service';
import { PrismaService } from '../../../database/prisma.service';
import { ScheduleStatus } from '../dto/create-schedule.dto';
import {
  mockScheduleId,
  mockScheduleResponse,
  mockCreateScheduleDto,
  mockSchedules,
  mockCourtId,
  mockUpdateScheduleDto,
  createMockPrismaService,
} from './schedules.mock';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = moduleRef.get<SchedulesService>(SchedulesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new schedule', async () => {
      mockPrismaService.schedule.create.mockResolvedValue(mockScheduleResponse);

      const result = await service.create(mockCreateScheduleDto);

      expect(mockPrismaService.schedule.create).toHaveBeenCalledWith({
        data: {
          startTime: new Date(mockCreateScheduleDto.startTime),
          endTime: new Date(mockCreateScheduleDto.endTime),
          price: mockCreateScheduleDto.price,
          status: mockCreateScheduleDto.status,
          courtId: mockCreateScheduleDto.courtId,
        },
        include: {
          court: {
            include: {
              establishment: true,
            },
          },
          booking: true,
        },
      });
      expect(result).toEqual(mockScheduleResponse);
    });

    it('should convert string dates to Date objects', async () => {
      mockPrismaService.schedule.create.mockResolvedValue(mockScheduleResponse);

      await service.create(mockCreateScheduleDto);

      const callArgs = mockPrismaService.schedule.create.mock.calls[0][0];
      expect(callArgs.data.startTime).toBeInstanceOf(Date);
      expect(callArgs.data.endTime).toBeInstanceOf(Date);
    });

    it('should create schedule with default AVAILABLE status', async () => {
      const dtoWithoutStatus = {
        ...mockCreateScheduleDto,
        status: undefined,
      };

      mockPrismaService.schedule.create.mockResolvedValue(mockScheduleResponse);

      const result = await service.create(dtoWithoutStatus);

      expect(result.status).toBe(ScheduleStatus.AVAILABLE);
    });
  });

  describe('findAll', () => {
    it('should return all schedules', async () => {
      mockPrismaService.schedule.findMany.mockResolvedValue(mockSchedules);

      const result = await service.findAll();

      expect(mockPrismaService.schedule.findMany).toHaveBeenCalledWith({
        include: {
          court: {
            include: {
              establishment: true,
            },
          },
          booking: true,
        },
      });
      expect(result).toEqual(mockSchedules);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no schedules exist', async () => {
      mockPrismaService.schedule.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a schedule by id', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(
        mockScheduleResponse,
      );

      const result = await service.findOne(mockScheduleId);

      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
        include: {
          court: {
            include: {
              establishment: true,
            },
          },
          booking: true,
        },
      });
      expect(result).toEqual(mockScheduleResponse);
    });

    it('should throw NotFoundException when schedule does not exist', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Schedule with ID non-existent-id not found',
      );
    });
  });

  describe('findByCourt', () => {
    it('should return schedules for a specific court', async () => {
      mockPrismaService.schedule.findMany.mockResolvedValue(mockSchedules);

      const result = await service.findByCourt(mockCourtId);

      expect(mockPrismaService.schedule.findMany).toHaveBeenCalledWith({
        where: { courtId: mockCourtId },
        include: {
          booking: true,
        },
      });
      expect(result).toEqual(mockSchedules);
    });
  });

  describe('findAvailable', () => {
    it('should return all available schedules', async () => {
      const availableSchedules = [mockScheduleResponse];
      mockPrismaService.schedule.findMany.mockResolvedValue(availableSchedules);

      const result = await service.findAvailable();

      expect(mockPrismaService.schedule.findMany).toHaveBeenCalledWith({
        where: {
          status: 'AVAILABLE',
        },
        include: {
          court: {
            include: {
              establishment: true,
            },
          },
        },
      });
      expect(result).toEqual(availableSchedules);
    });

    it('should filter available schedules by court', async () => {
      const availableSchedules = [mockScheduleResponse];
      mockPrismaService.schedule.findMany.mockResolvedValue(availableSchedules);

      const result = await service.findAvailable(mockCourtId);

      expect(mockPrismaService.schedule.findMany).toHaveBeenCalledWith({
        where: {
          status: 'AVAILABLE',
          courtId: mockCourtId,
        },
        include: {
          court: {
            include: {
              establishment: true,
            },
          },
        },
      });
      expect(result).toEqual(availableSchedules);
    });
  });

  describe('update', () => {
    it('should update a schedule', async () => {
      const updatedSchedule = {
        ...mockScheduleResponse,
        price: mockUpdateScheduleDto.price,
        status: mockUpdateScheduleDto.status,
      };

      mockPrismaService.schedule.findUnique.mockResolvedValue(
        mockScheduleResponse,
      );
      mockPrismaService.schedule.update.mockResolvedValue(updatedSchedule);

      const result = await service.update(
        mockScheduleId,
        mockUpdateScheduleDto,
      );

      expect(result.price).toBe(mockUpdateScheduleDto.price);
      expect(result.status).toBe(mockUpdateScheduleDto.status);
    });

    it('should throw NotFoundException when updating non-existent schedule', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', mockUpdateScheduleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a schedule by id', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(
        mockScheduleResponse,
      );
      mockPrismaService.schedule.delete.mockResolvedValue(mockScheduleResponse);

      const result = await service.remove(mockScheduleId);

      expect(mockPrismaService.schedule.delete).toHaveBeenCalledWith({
        where: { id: mockScheduleId },
      });
      expect(result).toEqual(mockScheduleResponse);
    });

    it('should throw NotFoundException when deleting non-existent schedule', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
