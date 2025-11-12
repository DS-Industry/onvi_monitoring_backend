import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LoyaltyProgramUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'loyaltyProgramId is required' })
  loyaltyProgramId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  maxLevels?: number;
  @IsNumber()
  @IsOptional()
  lifetimeDays?: number;
}
