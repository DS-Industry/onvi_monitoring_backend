import { Provider } from "@nestjs/common";
import { IManagerPaperRepository } from "@manager-paper/managerPaper/interface/managerPaper";
import { ManagerPaperRepository } from "@manager-paper/managerPaper/repository/managerPaper";

export const ManagerPaperRepositoryProvider: Provider = {
  provide: IManagerPaperRepository,
  useClass: ManagerPaperRepository,
}