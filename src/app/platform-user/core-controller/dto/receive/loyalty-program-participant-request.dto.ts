import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoyaltyProgramParticipantRequestDto {
  @IsNumber()
  @IsNotEmpty({ message: 'ltyProgramId is required' })
  ltyProgramId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;

  @IsString()
  @IsOptional()
  requestComment?: string;
}
