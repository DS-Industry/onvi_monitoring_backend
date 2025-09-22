import { IsOptional, IsString } from 'class-validator';

export class LoyaltyProgramHubRequestDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
