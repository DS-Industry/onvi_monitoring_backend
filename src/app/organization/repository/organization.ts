import { Injectable } from '@nestjs/common';
import { IOrganizationRepository } from '@organization/interfaces/organization';
import { PrismaService } from '@db/prisma/prisma.service';
import { Organization } from '@organization/domain/organization';
import { PrismaOrganizationMapper } from '@db/mapper/prisma-organization-mapper';

@Injectable()
export class OrganizationRepository extends IOrganizationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Organization): Promise<Organization> {
    const organizationPrismaEntity = PrismaOrganizationMapper.toPrisma(input);
    const organization = await this.prisma.organization.create({
      data: organizationPrismaEntity,
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
