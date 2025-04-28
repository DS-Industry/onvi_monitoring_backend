import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LoyaltyProgramUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'loyaltyProgramId is required' })
  loyaltyProgramId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsArray()
  @IsOptional()
  organizationIds?: number[];
}