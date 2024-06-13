import {
  IsArray,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { JSONObject } from '@common/types/json-type';
import { Type } from 'class-transformer';

export class CreatePermissionsDto {
  @IsString()
  @IsNotEmpty({ message: 'Action is required' })
  action: string;
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
