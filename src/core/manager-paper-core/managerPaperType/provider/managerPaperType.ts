import { Provider } from '@nestjs/common';
import { IManagerPaperTypeRepository } from '@manager-paper/managerPaperType/interface/managerPaperType';
import { ManagerPaperTypeRepository } from '@manager-paper/managerPaperType/repository/managerPaperType';

export const ManagerPaperTypeRepositoryProvider: Provider = {
  provide: IManagerPaperTypeRepository,
  useClass: ManagerPaperTypeRepository,
};
