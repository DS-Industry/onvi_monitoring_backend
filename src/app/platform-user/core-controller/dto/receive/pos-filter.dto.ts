import { IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class PosFilterDto {
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  posId: number | '*';
}