import { Provider } from '@nestjs/common';
import { IClientRepository } from '@mobile-user/client/interfaces/client';
import { ClientRepository } from '@mobile-user/client/repository/client';

export const ClientRepositoryProvider: Provider = {
  provide: IClientRepository,
  useClass: ClientRepository,
};
