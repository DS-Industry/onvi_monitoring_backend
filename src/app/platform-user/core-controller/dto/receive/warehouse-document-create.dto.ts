import {
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { WarehouseDocumentType } from '@prisma/client';

export class WarehouseDocumentCreateDto {
  @IsEnum(WarehouseDocumentType)
  @IsNotEmpty({ message: 'type is required' })
  type: WarehouseDocumentType;
}