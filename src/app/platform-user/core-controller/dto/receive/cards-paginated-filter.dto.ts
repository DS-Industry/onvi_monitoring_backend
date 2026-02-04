import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { LTYCardType } from '@prisma/client';

export class CardsPaginatedFilterDto {
  @IsNotEmpty({ message: 'organizationId is required' })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'organizationId must be a number' })
  organizationId: number;

  @IsOptional()
  @IsString({ message: 'unqNumber must be a string' })
  unqNumber?: string;

  @IsOptional()
  @IsString({ message: 'number must be a string' })
  number?: string;

  @IsOptional()
  @IsEnum(LTYCardType, { message: 'type must be VIRTUAL or PHYSICAL' })
  type?: LTYCardType;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
  })
  @IsBoolean()
  isCorporate?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'page must be a number' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'size must be a number' })
  size?: number;
}
