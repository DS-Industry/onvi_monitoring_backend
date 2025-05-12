import { Provider } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-user/permissions/user-permissions/interfaces/permissions';
import { PermissionRepository } from '@platform-user/permissions/user-permissions/repository/permission';

export const PermissionsRepositoryProvider: Provider = {
  provide: IPermissionsRepository,
  useClass: PermissionRepository,
};
