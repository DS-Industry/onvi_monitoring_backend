import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LTYBenefitType } from "@loyalty/loyalty/benefit/benefit/domain/benefitType";

export class BenefitCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsEnum(LTYBenefitType)
  @IsNotEmpty({ message: 'type is required' })
  type: LTYBenefitType;
  @IsNumber()
  @IsNotEmpty({ message: 'bonus is required' })
  bonus: number;
  @IsNumber()
  @IsOptional()
  benefitActionTypeId?: number;
}
