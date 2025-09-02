import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty({ message: 'Address is required' })
  organizationId: number;

}
