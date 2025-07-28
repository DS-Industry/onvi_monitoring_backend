import {
  IsArray,
  IsEmail, IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString, Length,
  Matches
} from "class-validator";
import { Transform } from 'class-transformer';
import { ContractType } from "@prisma/client";

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
  @IsEnum(ContractType)
  @IsNotEmpty({ message: 'Type client is required' })
  contractType: ContractType;
  @IsString()
  @IsOptional()
  comment?: string;
  @IsNumber()
  @IsOptional()
  placementId?: number;
  @IsString()
  @IsOptional()
  @Length(10, 10, { message: 'devNumber must be exactly 10 characters long' })
  devNumber?: string;
  @IsString()
  @IsOptional()
  @Length(10, 10, { message: 'number must be exactly 10 characters long' })
  number?: string;
  @IsNumber()
  @IsOptional()
  monthlyLimit?: number;
  @IsArray()
  @IsOptional()
  tagIds: number[];
}
