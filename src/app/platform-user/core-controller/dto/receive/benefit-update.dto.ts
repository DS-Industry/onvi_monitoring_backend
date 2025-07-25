import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LTYBenefitType } from '@prisma/client';

export class BenefitUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'benefitId is required' })
  benefitId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsNumber()
  @IsOptional()
  bonus?: number;
  @IsEnum(LTYBenefitType)
  @IsOptional()
  benefitType?: LTYBenefitType;
}
