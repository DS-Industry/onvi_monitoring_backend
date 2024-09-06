import { Provider } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { PosRepository } from '@pos/pos/repository/pos';

export const PosRepositoryProvider: Provider = {
  provide: IPosRepository,
  useClass: PosRepository,
};
