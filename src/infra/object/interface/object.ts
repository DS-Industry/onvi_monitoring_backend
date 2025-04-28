import { ObjectPermissions } from '../domain/object';

export abstract class IObjectPermissionsRepository {
  abstract findOneById(id: number): Promise<ObjectPermissions>;
}
