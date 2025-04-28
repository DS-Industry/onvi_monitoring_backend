import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LoyaltyTierCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsNotEmpty({ message: 'loyaltyProgramId is required' })
  loyaltyProgramId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'limitBenefit is required' })
  limitBenefit: number;
}
