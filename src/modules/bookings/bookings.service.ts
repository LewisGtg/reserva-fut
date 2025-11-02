import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    // Check if schedule exists and is available
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: createBookingDto.scheduleId },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (schedule.status !== 'AVAILABLE') {
      throw new BadRequestException('Schedule is not available');
    }

    // Create booking and update schedule status
    const booking = await this.prisma.booking.create({
      data: createBookingDto,
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

    // Update schedule status to RESERVED
    await this.prisma.schedule.update({
      where: { id: createBookingDto.scheduleId },
      data: { status: 'RESERVED' },
    });

    return booking;
  }

  async findAll() {
    return this.prisma.booking.findMany({
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
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
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

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
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
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
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
  }

  async cancel(id: string) {
    const booking = await this.findOne(id);

    // Update booking status
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
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

    // Update schedule status back to AVAILABLE
    await this.prisma.schedule.update({
      where: { id: booking.scheduleId },
      data: { status: 'AVAILABLE' },
    });

    return updatedBooking;
  }

  async remove(id: string) {
    const booking = await this.findOne(id);

    // Delete booking
    const deleted = await this.prisma.booking.delete({
      where: { id },
    });

    // Update schedule status back to AVAILABLE
    await this.prisma.schedule.update({
      where: { id: booking.scheduleId },
      data: { status: 'AVAILABLE' },
    });

    return deleted;
  }
}
