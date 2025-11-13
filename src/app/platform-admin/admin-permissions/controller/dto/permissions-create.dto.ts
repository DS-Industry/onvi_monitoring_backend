import { IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionAction } from '@platform-user/permissions/user-permissions/domain/permissionAction';

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
