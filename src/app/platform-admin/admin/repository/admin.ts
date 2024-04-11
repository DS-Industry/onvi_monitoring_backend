import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { Admin } from '@platform-admin/admin/domain/admin';
import { PrismaService } from "@db/prisma/prisma.service";

export class AdminRepository extends IAdminRepository {

  constructor(private readonly prisma: PrismaService) {
  }

  public async create(data: Admin): Promise<Admin> {
    return this.prisma.platformUser
  }

  public async createMany(data: Admin[]): Promise<Admin[]> {
    return Promise.resolve([]);
  }

  public async findAll(): Promise<Admin[]> {
    return Promise.resolve([]);
  }

  public async findOneById(id: string): Promise<Admin> {
    return Promise.resolve(undefined);
  }

  public async remove(id: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async update(id: string, data: Admin): Promise<Admin> {
    return Promise.resolve(undefined);
  }
}
