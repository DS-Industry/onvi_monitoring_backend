import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ManagerPaperTypeClass } from '@prisma/client';

export class ManagerPaperTypeCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsEnum(ManagerPaperTypeClass)
  @IsNotEmpty({ message: 'type is required' })
  type: ManagerPaperTypeClass;
}
