import { StatusTechTask, TypeTechTask } from "@prisma/client";
import { ReadAllByPosTechTaskUseCase } from "@tech-task/techTask/use-cases/techTask-read-all-by-pos";
import { TechTagProps } from "@tech-task/tag/domain/techTag";

export class TechTaskReadAllResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  endSpecifiedDate?: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
  tags: TechTagProps[];
}