import { Provider } from '@nestjs/common';
import { IObjectPermissionsRepository } from '@platform-admin/object/interfaces/object';
import { ObjectRepository } from '@platform-admin/object/repository/object';

export const ObjectPermissionsRepositoryProvider: Provider = {
  provide: IObjectPermissionsRepository,
  useClass: ObjectRepository,
};
