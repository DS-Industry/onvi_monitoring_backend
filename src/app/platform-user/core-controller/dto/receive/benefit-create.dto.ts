import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BenefitType } from '@prisma/client';

export class BenefitCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsEnum(BenefitType)
  @IsNotEmpty({ message: 'type is required' })
  type: BenefitType;
  @IsNumber()
  @IsNotEmpty({ message: 'bonus is required' })
  bonus: number;
  @IsNumber()
  @IsOptional()
  benefitActionTypeId?: number;
}
