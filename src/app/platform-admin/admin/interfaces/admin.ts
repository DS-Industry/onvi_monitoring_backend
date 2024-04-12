import { Admin } from '@platform-admin/admin/domain/admin';

export abstract class IAdminRepository {
  abstract create(input: Admin): Promise<Admin>;
  abstract createMany(input: Admin[]): Promise<Admin[]>;
  abstract findOneById(id: number): Promise<Admin>;
  abstract findOneByEmail(email: string): Promise<Admin>;
  abstract findAll(): Promise<Admin[]>;
  abstract update(id: number, input: Admin): Promise<Admin>;
  abstract remove(id: number): Promise<any>;
}
