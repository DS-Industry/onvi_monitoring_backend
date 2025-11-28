import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PosFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId?: number;
}
