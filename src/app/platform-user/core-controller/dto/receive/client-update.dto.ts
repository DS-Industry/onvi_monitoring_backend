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

export class ClientUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'clientId is required' })
  clientId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;
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
  monthlyLimit?: number;
  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
