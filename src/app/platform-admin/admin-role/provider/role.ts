import { Provider } from '@nestjs/common';
import { IRoleRepository } from '@platform-admin/admin-role/interfaces/role';
import { RoleRepository } from '@platform-admin/admin-role/repository/role';

export const RoleRepositoryProvider: Provider = {
  provide: IRoleRepository,
  useClass: RoleRepository,
};
