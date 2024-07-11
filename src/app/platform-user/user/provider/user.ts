import { Provider } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { UserRepository } from '@platform-user/user/repository/user';

export const UserRepositoryProvider: Provider = {
  provide: IUserRepository,
  useClass: UserRepository,
};



