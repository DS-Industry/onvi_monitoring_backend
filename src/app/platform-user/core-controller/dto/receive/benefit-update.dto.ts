import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LTYBenefitType } from '@loyalty/loyalty/benefit/benefit/domain/benefitType';
import { Transform } from 'class-transformer';

export class BenefitUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'benefitId is required' })
  benefitId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  bonus?: number;
  @IsEnum(LTYBenefitType)
  @IsOptional()
  benefitType?: LTYBenefitType;
  @IsNumber()
  @IsOptional()
  ltyProgramId?: number;
}
