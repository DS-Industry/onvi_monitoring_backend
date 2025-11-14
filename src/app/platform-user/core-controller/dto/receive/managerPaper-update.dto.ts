import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ManagerPaperGroup } from '@manager-paper/managerPaper/domain/managerPaperGroup';

export class ManagerPaperUpdateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'managerPaperId is required' })
  managerPaperId: number;
  @IsOptional()
  @IsEnum(ManagerPaperGroup)
  group?: ManagerPaperGroup;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  posId?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  paperTypeId?: number;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  eventDate?: Date;
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  sum?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  userId?: number;
  @IsOptional()
  @IsString()
  comment?: string;
}
