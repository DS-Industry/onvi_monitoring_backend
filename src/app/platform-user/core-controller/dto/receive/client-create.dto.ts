import {
  IsArray,
  IsEmail, IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches
} from "class-validator";
import { Transform } from 'class-transformer';
import { UserType } from "@prisma/client";

export class ClientCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthday?: Date;
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\+7(9\d{9})$/, {
    message: 'Phone number must be valid',
  })
  phone: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  gender?: string;
  @IsEnum(UserType)
  @IsNotEmpty({ message: 'Type client is required' })
  type: UserType;
  @IsString()
  @IsOptional()
  inn?: string;
  @IsString()
  @IsOptional()
  comment?: string;
  @IsNumber()
  @IsOptional()
  placementId?: number;
  @IsNumber()
  @IsOptional()
  devNumber?: number;
  @IsNumber()
  @IsOptional()
  number?: number;
  @IsNumber()
  @IsOptional()
  monthlyLimit?: number;
  @IsArray()
  @IsOptional()
  tagIds: number[];
}
