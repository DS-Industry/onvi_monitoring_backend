import { ObjectPermissions } from '@platform-user/object/domain/object';

export abstract class IObjectPermissionsRepository {
  abstract findOneById(id: number): Promise<ObjectPermissions>;
}
