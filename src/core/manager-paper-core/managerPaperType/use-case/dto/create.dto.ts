import { ManagerPaperTypeClass } from '@prisma/client';

export class CreateDto {
  name: string;
  type: ManagerPaperTypeClass;
}
