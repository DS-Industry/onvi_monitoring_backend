import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PositionsFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  organizationId?: number;
}
