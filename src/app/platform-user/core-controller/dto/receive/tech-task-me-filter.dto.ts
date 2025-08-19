import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { StatusTechTask } from "@tech-task/techTask/domain/statusTechTask";

export class TechTaskMeFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId?: number;
  @IsOptional()
  @IsEnum(StatusTechTask)
  status?: StatusTechTask;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
