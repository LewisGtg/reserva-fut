import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourtDto: CreateCourtDto) {
    return this.prisma.court.create({
      data: createCourtDto,
      include: {
        establishment: true,
        schedules: true,
      },
    });
  }

  async findAll() {
    return this.prisma.court.findMany({
      include: {
        establishment: true,
        schedules: true,
      },
    });
  }

  async findOne(id: string) {
    const court = await this.prisma.court.findUnique({
      where: { id },
      include: {
        establishment: true,
        schedules: true,
      },
    });

    if (!court) {
      throw new NotFoundException(`Court with ID ${id} not found`);
    }

    return court;
  }

  async findByEstablishment(establishmentId: string) {
    return this.prisma.court.findMany({
      where: { establishmentId },
      include: {
        schedules: true,
      },
    });
  }

  async update(id: string, updateCourtDto: UpdateCourtDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.court.update({
      where: { id },
      data: updateCourtDto,
      include: {
        establishment: true,
        schedules: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.court.delete({
      where: { id },
    });
  }
}
