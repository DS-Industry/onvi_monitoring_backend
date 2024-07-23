import { Provider } from '@nestjs/common';
import { IPermissionsRepository } from '@platform-user/user-permissions/interfaces/permissions';
import { PermissionRepository } from '@platform-user/user-permissions/repository/permission';

export const PermissionsRepositoryProvider: Provider = {
  provide: IPermissionsRepository,
  useClass: PermissionRepository,
};
