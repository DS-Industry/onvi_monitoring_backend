import { Admin } from '@platform-admin/admin/domain/admin';

export abstract class IAdminRepository {
  abstract create(data: Admin): Promise<Admin>;
  abstract createMany(date: Admin[]): Promise<Admin[]>;
  abstract findOneById(id: string): Promise<Admin>;
  abstract findAll(): Promise<Admin[]>;
  abstract update(id: string, data: Admin): Promise<Admin>;
  abstract remove(id: string): Promise<any>;
}
