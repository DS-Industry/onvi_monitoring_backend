import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PermissionAction } from '@prisma/client';

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
}
