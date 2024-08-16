import { IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PermissionAction } from '@prisma/client'; // Adjust import if needed

export class CreateDevicePermissionDto {
  @IsEnum(PermissionAction)
  @IsNotEmpty()
  action: PermissionAction;

  @IsNumber()
  @IsOptional()
  objectId?: number;

  @IsOptional()
  condition?: any;

  @IsNotEmpty({ each: true })
  roles: number[];
}
