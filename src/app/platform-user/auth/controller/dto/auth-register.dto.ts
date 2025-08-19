import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from "class-transformer";

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsString()
  @IsOptional()
  surname?: string;
  @IsString()
  @IsOptional()
  middlename?: string;
  @IsNotEmpty({ message: 'birthday is required' })
  @Transform(({ value }) => new Date(value))
  birthday: Date;
  @IsString()
  @IsNotEmpty({ message: 'phone is required' })
  @Matches(/^\+7(9\d{9})$/, {
    message: 'Phone number must be valid',
  })
  phone: string;
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'Password number is required' })
  password: string;
  @IsString()
  @IsOptional()
  fcmToken?: string;
}
