import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { EstablishmentsService } from './establishments.service';

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post()
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentsService.create(createEstablishmentDto);
  }

  @Get()
  findAll() {
    return this.establishmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
  ) {
    return this.establishmentsService.update(id, updateEstablishmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.establishmentsService.remove(id);
  }

  @Post(':establishmentId/managers/:managerId')
  addManager(
    @Param('establishmentId') establishmentId: string,
    @Param('managerId') managerId: string,
  ) {
    return this.establishmentsService.addManager(establishmentId, managerId);
  }

  @Delete(':establishmentId/managers/:managerId')
  removeManager(
    @Param('establishmentId') establishmentId: string,
    @Param('managerId') managerId: string,
  ) {
    return this.establishmentsService.removeManager(establishmentId, managerId);
  }
}
