import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WarehouseCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'location is required' })
  location: string;
  @IsNumber()
  @IsNotEmpty({ message: 'managerId is required' })
  managerId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'posId is required' })
  posId: number;
}
