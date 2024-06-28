import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';
import { PrismaService } from '@db/prisma/prisma.service';
import { Organization } from '@organization/organization/domain/organization';
import { PrismaOrganizationMapper } from '@db/mapper/prisma-organization-mapper';
import { User } from '@platform-user/user/domain/user';
import { PrismaPlatformUserMapper } from '@db/mapper/prisma-platform-user-mapper';

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

  public async findAllClient(id: number): Promise<User[]> {
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

  public async update(id: number, input: Organization): Promise<Organization> {
    const organizationPrismaEntity = PrismaOrganizationMapper.toPrisma(input);
    const organization = await this.prisma.organization.update({
      where: {
        id: id,
      },
      data: organizationPrismaEntity,
    });
    return PrismaOrganizationMapper.toDomain(organization);
  }
}
