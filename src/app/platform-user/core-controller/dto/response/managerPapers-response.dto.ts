import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';

export class ManagerPapersResponseDto {
  managerPapers: ManagerPaper[];
  totalCount: number;
}
