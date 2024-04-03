import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'Surname is required' })
  surname: string;
  @IsString()
  @IsOptional()
  middlename?: string;
  @IsDate()
  @IsOptional()
  birthday?: Date;
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
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
  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;
  @IsString()
  @IsOptional()
  avatar: string;
  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  country: string;
  @IsNumber()
  @IsNotEmpty({ message: 'Country code is required' })
  countryCode: number;
  @IsNumber()
  @IsNotEmpty({ message: 'Timezone is required' })
  timezone: number;
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshTokenId: string;
  @IsDate()
  @IsNotEmpty({ message: 'Created at token is required' })
  createdAt: Date;
  @IsDate()
  @IsNotEmpty({ message: 'Updated at token is required' })
  updatedAt: Date;
}
