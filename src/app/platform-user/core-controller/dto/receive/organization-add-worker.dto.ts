import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PositionUser } from '@platform-user/user/domain/positionUser';

export class AddWorkerOrganizationDto {
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
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'roleId is required' })
  roleId: number;
  @IsEnum(PositionUser)
  @IsNotEmpty({ message: 'position is required' })
  position: PositionUser;
}
