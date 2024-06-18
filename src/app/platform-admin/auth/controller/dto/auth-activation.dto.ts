import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthActivationDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'ConfirmString number is required' })
  confirmString: string;
}
