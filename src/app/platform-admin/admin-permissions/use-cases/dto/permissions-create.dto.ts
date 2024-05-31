import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { JSONObject } from '@common/types/json-type';

export class CreatePermissionsDto {
  @IsString()
  @IsNotEmpty({ message: 'Action is required' })
  action: string;
  @IsNumber()
  @IsNotEmpty({ message: 'ObjectId is required' })
  objectId: number;
  @IsJSON()
  @IsOptional()
  condition: JSONObject;
}
