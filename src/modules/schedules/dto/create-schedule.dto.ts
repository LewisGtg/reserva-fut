import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ScheduleStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
}

export class CreateScheduleDto {
  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsEnum(ScheduleStatus)
  @IsOptional()
  status?: ScheduleStatus;

  @IsString()
  @IsNotEmpty()
  courtId!: string;
}
