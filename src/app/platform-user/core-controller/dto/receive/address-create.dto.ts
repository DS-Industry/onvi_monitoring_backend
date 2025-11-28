import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  city: string;
  @IsString()
  @IsNotEmpty({ message: 'location is required' })
  location: string;
  @IsString()
  @IsOptional()
  lat?: string;
  @IsString()
  @IsOptional()
  lon?: string;
}
