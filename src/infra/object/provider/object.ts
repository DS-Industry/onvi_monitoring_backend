import { Provider } from '@nestjs/common';
import { IObjectPermissionsRepository } from '../interface/object';
import { ObjectRepository } from '../repository/object';

export const ObjectPermissionsRepositoryProvider: Provider = {
  provide: IObjectPermissionsRepository,
  useClass: ObjectRepository,
};
