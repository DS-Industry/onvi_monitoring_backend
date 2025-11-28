import { ManagerPaperTypeClass } from '@prisma/client';

export class UpdateDto {
  name?: string;
  type?: ManagerPaperTypeClass;
}
