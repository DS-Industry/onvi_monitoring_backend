export class ClientFavorite {
  id: number;
  clientId: number;
  carwashId: number;
  createdAt: Date;

  constructor(data: Partial<ClientFavorite>) {
    Object.assign(this, data);
  }

  public static create(clientId: number, carwashId: number): ClientFavorite {
    return new ClientFavorite({
      clientId,
      carwashId,
      createdAt: new Date(),
    });
  }
}
