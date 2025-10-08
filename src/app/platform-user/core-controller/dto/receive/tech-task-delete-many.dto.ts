import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class TechTaskDeleteManyDto {
  @IsArray()
  @IsNotEmpty({ message: 'ids is required' })
  @IsNumber({}, { each: true, message: 'Each id must be a number' })
  ids: number[];

  @IsOptional()
  @IsNumber({}, { message: 'posId must be a number' })
  posId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'organizationId must be a number' })
  organizationId?: number;
}
