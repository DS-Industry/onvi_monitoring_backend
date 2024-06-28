import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthPasswordConfirmDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
