import { IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class WorkerPosConnectionDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  workerId: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => 
    Array.isArray(value) ? value.map(id => parseInt(id)) : [parseInt(value)]
  )
  posIds: number[];
}
