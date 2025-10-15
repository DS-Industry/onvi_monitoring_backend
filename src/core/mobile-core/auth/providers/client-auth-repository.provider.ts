import { Provider } from '@nestjs/common';
import { IClientAuthRepository } from '../interfaces/client-auth-repository';
import { PrismaClientAuthRepository } from '../repositories/prisma-client-auth.repository';

export const ClientAuthRepositoryProvider: Provider = {
  provide: IClientAuthRepository,
  useClass: PrismaClientAuthRepository,
};
