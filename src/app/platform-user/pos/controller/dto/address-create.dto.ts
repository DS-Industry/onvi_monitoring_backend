import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddressCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'city is required' })
  city: string;
  @IsString()
  @IsNotEmpty({ message: 'location is required' })
  location: string;
  @IsNumber()
  @IsOptional()
  lat?: number;
  @IsNumber()
  @IsOptional()
  lon?: number;
}
