import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '../interfaces/organization';
import { PrismaService } from '@db/prisma/prisma.service';
import { Organization } from '../domain/organization';
import { PrismaOrganizationMapper } from '@db/mapper/prisma-organization-mapper';
import { User } from '@platform-user/user/domain/user';
import { PrismaPlatformUserMapper } from '@db/mapper/prisma-platform-user-mapper';
import { PrismaPosMapper } from '@db/mapper/prisma-pos-mapper';
import { Pos } from '@pos/pos/domain/pos';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class OrganizationRepository extends IOrganizationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Organization): Promise<Organization> {
    const organizationPrismaEntity = PrismaOrganizationMapper.toPrisma(input);
    const organization = await this.prisma.organization.create({
      data: {
        ...organizationPrismaEntity,
        users: {
          connect: { id: organizationPrismaEntity.ownerId },
        },
      },
    });
    return PrismaOrganizationMapper.toDomain(organization);
  }

  public async findAll(): Promise<Organization[]> {
    const organization = await this.prisma.organization.findMany();
    return organization.map((item) => PrismaOrganizationMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<Organization> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
      },
      include: {
        ownedLtyPrograms: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return PrismaOrganizationMapper.toDomain(organization);
  }

  public async findOneByName(name: string): Promise<Organization> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        name,
      },
    });
    return PrismaOrganizationMapper.toDomain(organization);
  }

  public async findOneBySlug(slug: string): Promise<Organization> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        slug,
      },
    });
    return PrismaOrganizationMapper.toDomain(organization);
  }

  public async findAllByOwner(ownerId: number): Promise<Organization[]> {
    const organization = await this.prisma.organization.findMany({
      where: { ownerId },
    });
    return organization.map((item) => PrismaOrganizationMapper.toDomain(item));
  }

  public async findAllByUser(
    userId: number,
    placementId: number | '*',
    findAllByUser?: boolean,
  ): Promise<Organization[]> {
    const organization = await this.prisma.organization.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        ...(placementId !== '*' && { placementId }),
        ...(findAllByUser && { ltyProgramId: null }),
      },
    });

    return organization.map((item) => PrismaOrganizationMapper.toDomain(item));
  }

  public async findAllByLoyaltyProgramId(
    ltyProgramId: number,
  ): Promise<Organization[]> {
    const organization = await this.prisma.organization.findMany({
      where: {
        ownedLtyPrograms: {
          some: {
            id: ltyProgramId,
          },
        },
      },
    });
    return organization.map((item) => PrismaOrganizationMapper.toDomain(item));
  }

  public async findAllUser(id: number): Promise<User[]> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
    const users = organization?.users || [];
    return users.map((item) => PrismaPlatformUserMapper.toDomain(item));
  }

  public async findAllPos(id: number): Promise<Pos[]> {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
      },
      include: {
        poses: true,
      },
    });
    const poses = organization?.poses || [];
    return poses.map((item) => PrismaPosMapper.toDomain(item));
  }

  public async findAllByPermission(
    ability: any,
    placementId: number | '*',
  ): Promise<Organization[]> {
    const organization = await this.prisma.organization.findMany({
      where: {
        AND: [
          accessibleBy(ability).Organization,
          placementId !== '*' ? { placementId } : {},
        ],
      },
    });
    return organization.map((item) => PrismaOrganizationMapper.toDomain(item));
  }

  public async update(input: Organization): Promise<Organization> {
    const organizationPrismaEntity = PrismaOrganizationMapper.toPrisma(input);
    const organization = await this.prisma.organization.update({
      where: {
        id: input.id,
      },
      data: organizationPrismaEntity,
    });
    return PrismaOrganizationMapper.toDomain(organization);
  }
}
