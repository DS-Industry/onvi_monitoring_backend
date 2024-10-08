import {
  IsArray, IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { Type } from 'class-transformer';
import { PermissionAction } from '@prisma/client';

export class CreatePermissionsDto {
  @IsEnum(PermissionAction)
  @IsNotEmpty({ message: 'Action is required' })
  action: PermissionAction;
  @IsNumber()
  @IsNotEmpty({ message: 'ObjectId is required' })
  objectId: number;
  @IsArray()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Roles is required' })
  roles: number[];
}
