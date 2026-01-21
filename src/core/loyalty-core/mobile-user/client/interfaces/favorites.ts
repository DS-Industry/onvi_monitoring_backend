export abstract class IFavoritesRepository {
  abstract findAllCarwashIdsByClientId(clientId: number): Promise<number[]>;
  abstract addCarwashIdByClientId(
    carWashId: number,
    clientId: number,
  ): Promise<number[]>;
  abstract removeCarwashIdByClientId(
    carWashId: number,
    clientId: number,
  ): Promise<number[]>;
}
