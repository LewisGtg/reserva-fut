import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Injectable()
export class EstablishmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEstablishmentDto: CreateEstablishmentDto) {
    return this.prisma.establishment.create({
      data: createEstablishmentDto,
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
  }

  async findAll() {
    return this.prisma.establishment.findMany({
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
  }

  async findOne(id: string) {
    const establishment = await this.prisma.establishment.findUnique({
      where: { id },
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

    if (!establishment) {
      throw new NotFoundException(`Establishment with ID ${id} not found`);
    }

    return establishment;
  }

  async update(id: string, updateEstablishmentDto: UpdateEstablishmentDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.establishment.update({
      where: { id },
      data: updateEstablishmentDto,
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
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.establishment.delete({
      where: { id },
    });
  }

  async addManager(establishmentId: string, managerId: string) {
    await this.findOne(establishmentId);

    return this.prisma.establishmentManager.create({
      data: {
        establishmentId,
        managerId,
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
  }

  async removeManager(establishmentId: string, managerId: string) {
    const relation = await this.prisma.establishmentManager.findFirst({
      where: {
        establishmentId,
        managerId,
      },
    });

    if (!relation) {
      throw new NotFoundException('Manager relationship not found');
    }

    return this.prisma.establishmentManager.delete({
      where: { id: relation.id },
    });
  }
}
