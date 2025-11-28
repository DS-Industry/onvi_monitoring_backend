import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PositionUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'positionId is required' })
  positionId: number;
  @IsOptional()
  @IsString()
  description?: string;
}
