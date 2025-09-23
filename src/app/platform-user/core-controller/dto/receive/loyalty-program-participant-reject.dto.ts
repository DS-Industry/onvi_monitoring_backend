import { IsOptional, IsString } from 'class-validator';

export class LoyaltyProgramParticipantRejectDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
