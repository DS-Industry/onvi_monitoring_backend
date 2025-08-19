import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@platform-user/user/interfaces/user';
import { PrismaService } from '@db/prisma/prisma.service';
import { PrismaPlatformUserMapper } from '@db/mapper/prisma-platform-user-mapper';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: User): Promise<User> {
    const userPrismaEntity = PrismaPlatformUserMapper.toPrisma(input);
    const user = await this.prisma.user.create({
      data: userPrismaEntity,
    });
    return PrismaPlatformUserMapper.toDomain(user);
  }

  public async createWorker(
    input: User,
    organizationId: number,
  ): Promise<User> {
    const userPrismaEntity = PrismaPlatformUserMapper.toPrisma(input);
    const user = await this.prisma.user.create({
      data: {
        ...userPrismaEntity,
        organizations: { connect: { id: organizationId } },
      },
    });
    return PrismaPlatformUserMapper.toDomain(user);
  }

  public async createMany(input: User[]): Promise<User[]> {
    return Promise.resolve([]);
  }

  public async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((item) => PrismaPlatformUserMapper.toDomain(item));
  }

  public async findAllByOrgId(orgId: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { organizations: { some: { id: orgId } } },
      include: {
        userRole: true,
      },
    });
    return users.map((item) => PrismaPlatformUserMapper.toDomain(item));
  }

  public async findAllByPosId(posId: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { posesPermissions: { some: { id: posId } } },
      include: {
        userRole: true,
      },
    });
    return users.map((item) => PrismaPlatformUserMapper.toDomain(item));
  }

  public async findAllByRoleIds(roleIds: number[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { userRoleId: { in: roleIds } },
      include: {
        userRole: true,
      },
    });
    return users.map((item) => PrismaPlatformUserMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    return PrismaPlatformUserMapper.toDomain(user);
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    return PrismaPlatformUserMapper.toDomain(user);
  }

  public async remove(id: number): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async update(id: number, input: User): Promise<User> {
    const userPrismaEntity = PrismaPlatformUserMapper.toPrisma(input);
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: userPrismaEntity,
    });
    return PrismaPlatformUserMapper.toDomain(user);
  }

  public async getAllPosPermissions(id: number): Promise<number[]> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        posesPermissions: true,
      },
    });
    return user?.posesPermissions?.map((item) => item.id) || [];
  }

  public async getAllLoyaltyProgramPermissions(id: number): Promise<number[]> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        ltyPrograms: true,
      },
    });
    return user?.ltyPrograms?.map((item) => item.id) || [];
  }

  public async getAllOrganizationPermissions(
    id: number,
  ): Promise<{ id: number; name: string }[]> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        organizations: true,
      },
    });
    return (
      user?.organizations?.map((item) => {
        return { id: item.id, name: item.name };
      }) || []
    );
  }

  public async updateConnectionPos(
    userId: number,
    addPosIds: number[],
    deletePosIds: number[],
  ): Promise<any> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        posesPermissions: {
          disconnect: deletePosIds.map((id) => ({ id })),
          connect: addPosIds.map((id) => ({ id })),
        },
      },
    });
  }
}
