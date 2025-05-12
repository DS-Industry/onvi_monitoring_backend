import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserUpdateRoleDto {
  @IsNumber()
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'roleId is required' })
  roleId: number;
}
