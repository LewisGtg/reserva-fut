import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { BookingsService } from '../bookings.service';
import { PrismaService } from '../../../database/prisma.service';
import {
  mockBookingId,
  mockBookingResponse,
  mockCreateBookingDto,
  mockBookings,
  mockUserId,
  mockSchedule,
  mockReservedSchedule,
  mockCancelledBooking,
  createMockPrismaService,
} from './bookings.mock';

describe('BookingsService', () => {
  let service: BookingsService;
  let mockPrismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = moduleRef.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking and update schedule status', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);
      mockPrismaService.booking.create.mockResolvedValue(mockBookingResponse);
      mockPrismaService.schedule.update.mockResolvedValue(mockReservedSchedule);

      const result = await service.create(mockCreateBookingDto);

      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: mockCreateBookingDto.scheduleId },
      });
      expect(mockPrismaService.booking.create).toHaveBeenCalledWith({
        data: mockCreateBookingDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          schedule: {
            include: {
              court: {
                include: {
                  establishment: true,
                },
              },
            },
          },
        },
      });
      expect(mockPrismaService.schedule.update).toHaveBeenCalledWith({
        where: { id: mockCreateBookingDto.scheduleId },
        data: { status: 'RESERVED' },
      });
      expect(result).toEqual(mockBookingResponse);
    });

    it('should throw NotFoundException when schedule does not exist', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.create(mockCreateBookingDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(mockCreateBookingDto)).rejects.toThrow(
        'Schedule not found',
      );
    });

    it('should throw BadRequestException when schedule is not available', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(
        mockReservedSchedule,
      );

      await expect(service.create(mockCreateBookingDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(mockCreateBookingDto)).rejects.toThrow(
        'Schedule is not available',
      );
    });
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue(mockBookings);

      const result = await service.findAll();

      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          schedule: {
            include: {
              court: {
                include: {
                  establishment: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockBookings);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no bookings exist', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(
        mockBookingResponse,
      );

      const result = await service.findOne(mockBookingId);

      expect(mockPrismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: mockBookingId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          schedule: {
            include: {
              court: {
                include: {
                  establishment: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockBookingResponse);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Booking with ID non-existent-id not found',
      );
    });
  });

  describe('findByUser', () => {
    it('should return bookings for a specific user', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([
        mockBookingResponse,
      ]);

      const result = await service.findByUser(mockUserId);

      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: {
          schedule: {
            include: {
              court: {
                include: {
                  establishment: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual([mockBookingResponse]);
    });

    it('should return empty array when user has no bookings', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([]);

      const result = await service.findByUser('user-no-bookings');

      expect(result).toEqual([]);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking and update schedule status', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(
        mockBookingResponse,
      );
      mockPrismaService.booking.update.mockResolvedValue(mockCancelledBooking);
      mockPrismaService.schedule.update.mockResolvedValue(mockSchedule);

      const result = await service.cancel(mockBookingId);

      expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
        where: { id: mockBookingId },
        data: { status: 'CANCELLED' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          schedule: {
            include: {
              court: {
                include: {
                  establishment: true,
                },
              },
            },
          },
        },
      });
      expect(mockPrismaService.schedule.update).toHaveBeenCalledWith({
        where: { id: mockBookingResponse.scheduleId },
        data: { status: 'AVAILABLE' },
      });
      expect(result).toEqual(mockCancelledBooking);
    });

    it('should throw NotFoundException when cancelling non-existent booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.cancel('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a booking and update schedule status', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(
        mockBookingResponse,
      );
      mockPrismaService.booking.delete.mockResolvedValue(mockBookingResponse);
      mockPrismaService.schedule.update.mockResolvedValue(mockSchedule);

      const result = await service.remove(mockBookingId);

      expect(mockPrismaService.booking.delete).toHaveBeenCalledWith({
        where: { id: mockBookingId },
      });
      expect(mockPrismaService.schedule.update).toHaveBeenCalledWith({
        where: { id: mockBookingResponse.scheduleId },
        data: { status: 'AVAILABLE' },
      });
      expect(result).toEqual(mockBookingResponse);
    });

    it('should throw NotFoundException when deleting non-existent booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
