import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PositionCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
  @IsString()
  @IsOptional()
  description?: string;
}
