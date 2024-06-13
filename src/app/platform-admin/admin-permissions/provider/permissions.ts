import { Provider } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-admin/admin-permissions/interfaces/permissions';
import { PermissionRepository } from '@platform-admin/admin-permissions/repository/permission';

export const PermissionsRepositoryProvider: Provider = {
  provide: IPermissionsRepository,
  useClass: PermissionRepository,
};
