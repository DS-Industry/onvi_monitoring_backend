import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class WarehousePaginatedFilterDto {
  @IsNotEmpty({ message: 'organizationId is required' })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  organizationId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  posId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
