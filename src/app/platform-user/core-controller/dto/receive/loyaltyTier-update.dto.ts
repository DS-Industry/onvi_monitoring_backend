import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LoyaltyTierUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'loyaltyTierId is required' })
  loyaltyTierId: number;
  @IsString()
  @IsOptional()
  description?: string;
  @IsArray()
  @IsOptional()
  benefitIds: number[];
  @IsNumber()
  @IsOptional()
  limitBenefit?: number;
}
