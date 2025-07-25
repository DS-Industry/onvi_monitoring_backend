import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { ContractType } from "@prisma/client";

export class ClientUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'clientId is required' })
  clientId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsEnum(ContractType)
  @IsOptional()
  type?: ContractType;
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
  @IsNumber()
  @IsOptional()
  loyaltyCardTierId?: number;
  @IsArray()
  @IsOptional()
  tagIds?: number[];
}
