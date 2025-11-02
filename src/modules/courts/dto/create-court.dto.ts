import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsNumber()
  @IsNotEmpty()
  hourlyPrice!: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  establishmentId!: string;
}
