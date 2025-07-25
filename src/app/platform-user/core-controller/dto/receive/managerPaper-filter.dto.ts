import { IsNotEmpty, IsOptional } from 'class-validator';
import { ManagerPaperGroup } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ManagerPaperFilterDto {
  @IsNotEmpty({ message: 'group is required' })
  group: ManagerPaperGroup | '*';
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  posId: number | '*';
  @IsNotEmpty({ message: 'paperTypeId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  paperTypeId: number | '*';
  @IsNotEmpty({ message: 'userId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  userId: number | '*';
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dateStartEvent?: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dateEndEvent?: Date;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
