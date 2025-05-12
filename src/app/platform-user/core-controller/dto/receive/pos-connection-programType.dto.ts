import { IsArray, IsNotEmpty } from 'class-validator';

export class PosConnectionProgramTypeDto {
  @IsArray()
  @IsNotEmpty({ message: 'programTypeIds is required' })
  programTypeIds: number[];
}