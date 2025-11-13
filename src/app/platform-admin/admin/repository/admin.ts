import { IAdminRepository } from '@platform-admin/admin/interfaces/admin';
import { Admin } from '@platform-admin/admin/domain/admin';
import { PrismaService } from '@db/prisma/prisma.service';
import { PrismaPlatformAdminMapper } from '@db/mapper/prisma-platform-admin-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminRepository extends IAdminRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Admin): Promise<Admin> {
    const adminPrismaEntity = PrismaPlatformAdminMapper.toPrisma(input);
    const admin = await this.prisma.platformUser.create({
      data: adminPrismaEntity,
    });
    return PrismaPlatformAdminMapper.toDomain(admin);
  }

  public async createMany(): Promise<Admin[]> {
    return Promise.resolve([]);
  }

  public async findAll(): Promise<Admin[]> {
    const admins = await this.prisma.platformUser.findMany();
    return admins.map((item) => PrismaPlatformAdminMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<Admin> {
    const admin = await this.prisma.platformUser.findFirst({
      where: {
        id,
      },
    });
    return PrismaPlatformAdminMapper.toDomain(admin);
  }

  public async findOneByEmail(email: string): Promise<Admin> {
    const admin = await this.prisma.platformUser.findFirst({
      where: {
        email,
      },
    });
    return PrismaPlatformAdminMapper.toDomain(admin);
  }

  public async remove(): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async update(id: number, input: Admin): Promise<Admin> {
    const adminPrismaEntity = PrismaPlatformAdminMapper.toPrisma(input);
    const admin = await this.prisma.platformUser.update({
      where: {
        id: id,
      },
      data: adminPrismaEntity,
    });
    return PrismaPlatformAdminMapper.toDomain(admin);
  }
}
