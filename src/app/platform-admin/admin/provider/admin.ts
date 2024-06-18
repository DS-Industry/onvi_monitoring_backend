import { Provider } from '@nestjs/common';
import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { AdminRepository } from '@platform-admin/admin/repository/admin';

export const AdminRepositoryProvider: Provider = {
  provide: IAdminRepository,
  useClass: AdminRepository,
};
