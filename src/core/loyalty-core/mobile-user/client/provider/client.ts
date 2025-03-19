import { Provider } from '@nestjs/common';
import { IClientRepository } from '../interfaces/client';
import { ClientRepository } from '../repository/client';

export const ClientRepositoryProvider: Provider = {
  provide: IClientRepository,
  useClass: ClientRepository,
};
