import { IBaseRepositoryInterface } from '../../../common/interfaces/baseRepository.interface';
import { Prisma, PlatformUser } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaUseCase } from '@prisma/prisma.service';

@Injectable()
export class PlatformAdminRepository
  implements IBaseRepositoryInterface<PlatformUser>
{
  constructor(private readonly prismaUseCase: PrismaUseCase) {}
  async create(data: any): Promise<PlatformUser> {
    return this.prismaUseCase.platformUser.create({ data });
  }

  async createMany(date: any): Promise<any[]> {
    return [];
  }

  async findAll(): Promise<PlatformUser[]> {
    return this.prismaUseCase.platformUser.findMany();
  }

  async findOneById(id: any): Promise<PlatformUser> {
    return this.prismaUseCase.platformUser.findUnique({ where: id });
  }

  async findOneByPhone(phone: string): Promise<PlatformUser> {
    return this.prismaUseCase.platformUser.findUnique({ where: { phone } });
  }

  async findOneByEmail(email: string): Promise<PlatformUser> {
    return this.prismaUseCase.platformUser.findUnique({ where: { email } });
  }

  async remove(params: {
    where: Prisma.PlatformUserWhereUniqueInput;
  }): Promise<PlatformUser> {
    const { where } = params;
    return this.prismaUseCase.platformUser.delete({ where });
  }

  async update(params: {
    where: Prisma.PlatformUserWhereUniqueInput;
    data: Prisma.PlatformUserUpdateInput;
  }): Promise<PlatformUser> {
    const { where, data } = params;
    return this.prismaUseCase.platformUser.update({ where, data });
  }
}
