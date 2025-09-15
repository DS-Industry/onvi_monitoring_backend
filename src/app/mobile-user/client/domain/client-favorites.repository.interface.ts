export interface IClientFavoritesRepository {
  getFavorites(clientId: number): Promise<number[]>;
  addFavorite(clientId: number, carwashId: number): Promise<number[]>;
  removeFavorite(clientId: number, carwashId: number): Promise<number[]>;
}
