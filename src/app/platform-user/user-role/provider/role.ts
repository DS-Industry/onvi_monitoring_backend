import { Provider } from '@nestjs/common';
import { IRoleRepository } from '@platform-user/user-role/interfaces/role';
import { RoleRepository } from '@platform-user/user-role/repository/role';

export const RoleRepositoryProvider: Provider = {
  provide: IRoleRepository,
  useClass: RoleRepository,
};
