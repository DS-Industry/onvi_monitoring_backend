import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetByEmailUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
