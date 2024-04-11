import { IBaseRepositoryInterface } from '../../../common/interfaces/baseRepository.interface';
import { Prisma, PlatformUser } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class PlatformAdminRepository
  implements IBaseRepositoryInterface<PlatformUser>
{
  constructor(private readonly prismaService: PrismaService) {}
  async create(params: {
    data: Prisma.PlatformUserCreateInput;
  }): Promise<PlatformUser> {
    const { data } = params;
    return this.prismaService.platformUser.create({ data });
  }

  async createMany(date: any): Promise<any[]> {
    return [];
  }

  async findAll(): Promise<PlatformUser[]> {
    return this.prismaService.platformUser.findMany();
  }

  async findOneById(id: any): Promise<PlatformUser> {
    return this.prismaService.platformUser.findUnique({ where: id });
  }

  async findOneByPhone(phone: string): Promise<PlatformUser> {
    return this.prismaService.platformUser.findUnique({ where: { phone } });
  }

  async findOneByEmail(email: string): Promise<PlatformUser> {
    return this.prismaService.platformUser.findUnique({ where: { email } });
  }

  async remove(params: {
    where: Prisma.PlatformUserWhereUniqueInput;
  }): Promise<PlatformUser> {
    const { where } = params;
    return this.prismaService.platformUser.delete({ where });
  }

  async update(params: {
    where: Prisma.PlatformUserWhereUniqueInput;
    data: Prisma.PlatformUserUpdateInput;
  }): Promise<PlatformUser> {
    const { where, data } = params;
    return this.prismaService.platformUser.update({ where, data });
  }
}
