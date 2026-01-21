import { Provider } from '@nestjs/common';
import { IFavoritesRepository } from '../interfaces/favorites';
import { FavoritesRepository } from '../repository/favorites';

export const FavoritesRepositoryProvider: Provider = {
  provide: IFavoritesRepository,
  useClass: FavoritesRepository,
};
