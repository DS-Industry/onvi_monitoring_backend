import { IsArray, IsNotEmpty } from "class-validator";

export class ManagerPaperDeleteManyDto {
  @IsArray()
  @IsNotEmpty({ message: 'ids is required' })
  ids: number[];
}