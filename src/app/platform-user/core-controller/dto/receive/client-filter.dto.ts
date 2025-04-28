import { IsArray, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { Transform } from 'class-transformer';
import { UserType } from '@prisma/client';

export class ClientFilterDto {
  @IsNotEmpty({ message: 'placementId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  placementId: number | '*';
  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  type: UserType | '*';
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const cleanedValue = value.replace(/[\[\]\s]/g, '');
      return cleanedValue
        .split(',')
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id)); // Удаляем NaN
    }
    return value;
  })
  tagIds: number[];
  @IsString()
  @IsOptional()
  phone?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
