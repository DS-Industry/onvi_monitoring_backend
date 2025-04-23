import { Provider } from '@nestjs/common';
import { IPositionRepository } from '@hr/position/interface/position';
import { PositionRepository } from '@hr/position/repository/position';

export const PositionRepositoryProvider: Provider = {
  provide: IPositionRepository,
  useClass: PositionRepository,
};
