import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoyaltyTierFilterDto {
  @IsNotEmpty({ message: 'programId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  programId: number | '*';
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }
  })
  onlyWithoutChildren?: boolean;
}
