import { IsNotEmpty, IsOptional } from 'class-validator';
import { ManagerPaperGroup } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ManagerPaperFilterDto {
  @IsOptional()
  group?: ManagerPaperGroup;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  paperTypeId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  userId?: number;
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
