import { IsNotEmpty, IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum LoyaltyProgramStatus {
  ACTIVE = 'ACTIVE',
  PAUSE = 'PAUSE',
}

export enum ParticipationRole {
  OWNER = 'owner',
  PARTICIPANT = 'participant',
  ALL = 'all',
}

export class LoyaltyParticipantProgramsFilterDto {
  @IsNotEmpty({ message: 'organizationId is required' })
  @Transform(({ value }) => parseInt(value))
  organizationId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;

  @IsOptional()
  @IsEnum(LoyaltyProgramStatus, { message: 'status must be ACTIVE or PAUSE' })
  status?: LoyaltyProgramStatus;

  @IsOptional()
  @IsEnum(ParticipationRole, {
    message: 'participationRole must be owner, participant, or all',
  })
  participationRole?: ParticipationRole;

  @IsOptional()
  @IsString()
  search?: string;
}
