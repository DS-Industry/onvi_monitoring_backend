import { IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PermissionAction } from "@platform-user/permissions/user-permissions/domain/permissionAction";

export class CreateDevicePermissionDto {
  @IsEnum(PermissionAction)
  @IsNotEmpty()
  action: PermissionAction;

  @IsNumber()
  @IsOptional()
  objectId?: number;

  @IsNotEmpty({ each: true })
  roles: number[];
}
