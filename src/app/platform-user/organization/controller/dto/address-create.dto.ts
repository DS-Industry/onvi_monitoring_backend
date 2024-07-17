import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddressCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  city: string;
  @IsString()
  @IsNotEmpty({ message: 'location is required' })
  location: string;
  @IsNumber()
  @IsNotEmpty({ message: 'lat is required' })
  lat: number;
  @IsNumber()
  @IsNotEmpty({ message: 'lon is required' })
  lon: number;
}
