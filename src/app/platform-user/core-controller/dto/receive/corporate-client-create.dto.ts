import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CorporateClientCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'INN is required' })
  inn: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Organization ID is required' })
  organizationId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: 'Loyalty program ID is required' })
  ltyProgramId: number;
}
