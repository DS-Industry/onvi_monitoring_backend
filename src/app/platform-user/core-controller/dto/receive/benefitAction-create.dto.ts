import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class BenefitActionCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsOptional()
  description?: string;
}
