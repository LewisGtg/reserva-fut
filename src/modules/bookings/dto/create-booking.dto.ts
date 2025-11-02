import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  scheduleId!: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
