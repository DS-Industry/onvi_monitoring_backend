import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class MarketingCampaignCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Campaign name is required' })
  name: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty({ message: 'Launch date is required' })
  launchDate: Date;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Loyalty program ID is required' })
  ltyProgramId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Loyalty program participant ID is required' })
  ltyProgramParticipantId: number;
}
