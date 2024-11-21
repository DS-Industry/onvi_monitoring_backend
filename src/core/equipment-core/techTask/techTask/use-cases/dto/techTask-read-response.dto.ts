import { StatusTechTask, TypeTechTask } from "@prisma/client";

export class TechTaskShapeResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
}