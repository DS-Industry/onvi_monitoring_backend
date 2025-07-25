import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ManagerPaperGroup } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ManagerPaperCreateDto {
  @IsEnum(ManagerPaperGroup)
  @IsNotEmpty({ message: 'group is required' })
  group: ManagerPaperGroup;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'posId is required' })
  posId: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'paperTypeId is required' })
  paperTypeId: number;
  @IsNotEmpty({ message: 'eventDate is required' })
  @Transform(({ value }) => new Date(value))
  eventDate: Date;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'sum is required' })
  sum: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
  @IsOptional()
  @IsString()
  comment?: string;
}
