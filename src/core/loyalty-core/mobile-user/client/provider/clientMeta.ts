import { Provider } from '@nestjs/common';
import { IClientMetaRepository } from '../interfaces/clientMeta';
import { ClientMetaRepository } from '../repository/clientMeta';

export const ClientMetaRepositoryProvider: Provider = {
  provide: IClientMetaRepository,
  useClass: ClientMetaRepository,
};
