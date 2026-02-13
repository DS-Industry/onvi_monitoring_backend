import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LTYBenefitType } from '@loyalty/loyalty/benefit/benefit/domain/benefitType';

export class BenefitCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsEnum(LTYBenefitType)
  @IsNotEmpty({ message: 'type is required' })
  type: LTYBenefitType;
  @IsNumber()
  @IsNotEmpty({ message: 'bonus is required' })
  @Type(() => Number)
  bonus: number;
  @IsNumber()
  @IsNotEmpty({ message: 'ltyProgramId is required' })
  @Type(() => Number)
  ltyProgramId: number;
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  benefitActionTypeId?: number;
}
