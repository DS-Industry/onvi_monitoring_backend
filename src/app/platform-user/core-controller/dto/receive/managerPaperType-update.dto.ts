import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ManagerPaperTypeClass } from "@prisma/client";
import { Transform } from "class-transformer";

export class ManagerPaperTypeUpdateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'managerPaperTypeId is required' })
  managerPaperTypeId: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsEnum(ManagerPaperTypeClass)
  @IsOptional()
  type?: ManagerPaperTypeClass;
}