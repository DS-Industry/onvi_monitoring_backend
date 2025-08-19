import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ManagerPaperType } from "@manager-paper/managerPaper/domain/managerPaperType";

export class ManagerPaperTypeUpdateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'managerPaperTypeId is required' })
  managerPaperTypeId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsEnum(ManagerPaperType)
  @IsOptional()
  type?: ManagerPaperType;
}