import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required' })
  id: number;
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
