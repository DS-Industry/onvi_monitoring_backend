import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import { JSONObject } from '@common/types/json-type';
import { PermissionAction } from "@prisma/client";

export class UpdatePermissionsDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  id: number;
  @IsEnum(PermissionAction)
  @IsNotEmpty({ message: 'Action is required' })
  action: PermissionAction;
  @IsNumber()
  @IsNotEmpty({ message: 'ObjectId is required' })
  objectId: number;
  @IsJSON()
  @IsOptional()
  condition: JSONObject;
}
