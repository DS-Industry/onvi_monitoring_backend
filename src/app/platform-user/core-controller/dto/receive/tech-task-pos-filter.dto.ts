import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';

export class TechTaskPosFilterDto {
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
