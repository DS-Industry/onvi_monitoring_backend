import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteManyDto {
  @IsArray()
  @IsNotEmpty({ message: 'ids is required' })
  ids: number[];
}
