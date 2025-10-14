import { IsOptional, IsString } from 'class-validator';

export class LoyaltyProgramHubRejectDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
