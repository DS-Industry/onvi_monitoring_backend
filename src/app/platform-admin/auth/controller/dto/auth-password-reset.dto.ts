import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthPasswordResetDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'ConfirmString number is required' })
  confirmString: string;
  @IsString()
  @IsNotEmpty({ message: 'New password number is required' })
  newPassword: string;
  @IsString()
  @IsNotEmpty({ message: 'New password number is required' })
  checkNewPassword: string;
}
