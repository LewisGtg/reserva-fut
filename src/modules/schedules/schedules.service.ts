import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDto) {
    return this.prisma.schedule.create({
      data: {
        ...createScheduleDto,
        startTime: new Date(createScheduleDto.startTime),
        endTime: new Date(createScheduleDto.endTime),
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
  }

  async findAll() {
    return this.prisma.schedule.findMany({
      include: {
        court: {
          include: {
            establishment: true,
          },
        },
        booking: true,
      },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        court: {
          include: {
            establishment: true,
          },
        },
        booking: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async findByCourt(courtId: string) {
    return this.prisma.schedule.findMany({
      where: { courtId },
      include: {
        booking: true,
      },
    });
  }

  async findAvailable(courtId?: string) {
    return this.prisma.schedule.findMany({
      where: {
        status: 'AVAILABLE',
        ...(courtId && { courtId }),
      },
      include: {
        court: {
          include: {
            establishment: true,
          },
        },
      },
    });
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    await this.findOne(id); // Check if exists

    const updateData: UpdateScheduleDto = { ...updateScheduleDto };
    if (updateScheduleDto.startTime) {
      updateData.startTime = String(new Date(updateScheduleDto.startTime));
    }
    if (updateScheduleDto.endTime) {
      updateData.endTime = String(new Date(updateScheduleDto.endTime));
    }

    return this.prisma.schedule.update({
      where: { id },
      data: updateData,
      include: {
        court: {
          include: {
            establishment: true,
          },
        },
        booking: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}
