import { IsNotEmpty, IsString } from 'class-validator';

export class SupplierCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'contact is required' })
  contact: string;
}
