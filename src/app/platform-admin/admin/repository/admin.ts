import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { Admin } from '@platform-admin/admin/domain/admin';

export class AdminRepository extends IAdminRepository {
  create(data: Admin): Promise<Admin> {
    return Promise.resolve(undefined);
  }

  createMany(date: Admin[]): Promise<Admin[]> {
    return Promise.resolve([]);
  }

  findAll(): Promise<Admin[]> {
    return Promise.resolve([]);
  }

  findOneById(id: string): Promise<Admin> {
    return Promise.resolve(undefined);
  }

  remove(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  update(id: string, data: Admin): Promise<Admin> {
    return Promise.resolve(undefined);
  }
}
