import { IsOptional, IsString, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { StatusUser } from "@prisma/client";

export class WorkerPermissionFilterDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  roleId?: number;

  @IsOptional()
  @IsEnum(StatusUser)
  status?: StatusUser;

  @IsOptional()
  @IsString()
  name?: string;
}
