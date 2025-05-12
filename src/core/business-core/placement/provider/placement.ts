import { Provider } from '@nestjs/common';
import { IPlacementRepository } from '@business-core/placement/interface/placement';
import { PlacementRepository } from '@business-core/placement/repository/placement';

export const PlacementRepositoryProvider: Provider = {
  provide: IPlacementRepository,
  useClass: PlacementRepository,
};
