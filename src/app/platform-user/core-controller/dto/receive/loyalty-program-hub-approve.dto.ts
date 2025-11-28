import { IsOptional, IsString } from 'class-validator';

export class LoyaltyProgramHubApproveDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
