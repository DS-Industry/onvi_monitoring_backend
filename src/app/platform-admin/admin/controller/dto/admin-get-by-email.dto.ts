import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetByEmailAdminDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
