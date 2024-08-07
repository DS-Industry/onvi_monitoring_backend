import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { JSONObject } from '@common/types/json-type';
import { Type } from 'class-transformer';
import { PermissionAction } from '@prisma/client';

export class CreatePermissionsDto {
  @IsNotEmpty({ message: 'Action is required' })
  action: PermissionAction;
  @IsNumber()
  @IsNotEmpty({ message: 'ObjectId is required' })
  objectId: number;
  @IsOptional()
  condition: JSONObject;
  @IsArray()
  @Type(() => Number)
  @IsNotEmpty({ message: 'Roles is required' })
  roles: number[];
}
