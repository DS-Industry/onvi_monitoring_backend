import { IsOptional, IsString } from 'class-validator';

export class LoyaltyProgramParticipantApproveDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
