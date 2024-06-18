import { ObjectPermissions } from '@platform-admin/object/domain/object';

export abstract class IObjectPermissionsRepository {
  abstract findOneById(id: number): Promise<ObjectPermissions>;
}
