import { StatusTechTask, TypeTechTask } from "@prisma/client";

export class TechTaskShapeResponseDto {
  id: number;
  name: string;
  posId: number;
  type: TypeTechTask;
  status: StatusTechTask;
  endSpecifiedDate?: Date;
  startWorkDate?: Date;
  sendWorkDate?: Date;
  executorId?: number;
}