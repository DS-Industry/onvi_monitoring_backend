import { Provider } from '@nestjs/common';
import { IObjectPermissionsRepository } from '@platform-user/object/interfaces/object';
import { ObjectRepository } from '@platform-user/object/repository/object';

export const ObjectPermissionsRepositoryProvider: Provider = {
  provide: IObjectPermissionsRepository,
  useClass: ObjectRepository,
};
