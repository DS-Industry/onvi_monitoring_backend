import { IsOptional, IsString } from 'class-validator';

export class CorporateClientUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsString()
  inn?: string;
  
  @IsOptional()
  @IsString()
  address?: string;
}
