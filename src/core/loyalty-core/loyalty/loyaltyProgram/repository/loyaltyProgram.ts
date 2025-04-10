import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { PrismaService } from '@db/prisma/prisma.service';
import { LoyaltyProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { PrismaLoyaltyProgramMapper } from '@db/mapper/prisma-loyalty-program-mapper';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class LoyaltyProgramRepository extends ILoyaltyProgramRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: LoyaltyProgram,
    organizationIds: number[],
    userId: number,
  ): Promise<LoyaltyProgram> {
    const LoyaltyProgramEntity = PrismaLoyaltyProgramMapper.toPrisma(input);
    const loyaltyProgram = await this.prisma.loyaltyProgram.create({
      data: {
        ...LoyaltyProgramEntity,
        organizations: { connect: organizationIds.map((id) => ({ id })) },
        managers: { connect: { id: userId } },
      },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findOneById(id: number): Promise<LoyaltyProgram> {
    const loyaltyProgram = await this.prisma.loyaltyProgram.findFirst({
      where: { id },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findOneByOrganizationId(
    organizationId: number,
  ): Promise<LoyaltyProgram> {
    const loyaltyProgram = await this.prisma.loyaltyProgram.findFirst({
      where: {
        organizations: {
          some: {
            id: organizationId,
          },
        },
      },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findOneByLoyaltyCardTierId(
    loyaltyCardTierId: number,
  ): Promise<LoyaltyProgram> {
    const loyaltyProgram = await this.prisma.loyaltyProgram.findFirst({
      where: {
        loyaltyCardTiers: {
          some: {
            id: loyaltyCardTierId,
          },
        },
      },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findAll(): Promise<LoyaltyProgram[]> {
    const loyaltyPrograms = await this.prisma.loyaltyProgram.findMany();
    return loyaltyPrograms.map((item) =>
      PrismaLoyaltyProgramMapper.toDomain(item),
    );
  }

  public async findAllByPermission(ability: any): Promise<LoyaltyProgram[]> {
    const loyaltyPrograms = await this.prisma.loyaltyProgram.findMany({
      where: accessibleBy(ability).LoyaltyProgram,
    });
    return loyaltyPrograms.map((item) =>
      PrismaLoyaltyProgramMapper.toDomain(item),
    );
  }

  public async update(
    input: LoyaltyProgram,
    addOrganizationIds: number[],
    deleteOrganizationIds: number[],
  ): Promise<LoyaltyProgram> {
    const LoyaltyProgramEntity = PrismaLoyaltyProgramMapper.toPrisma(input);
    const loyaltyProgram = await this.prisma.loyaltyProgram.update({
      where: {
        id: input.id,
      },
      data: {
        ...LoyaltyProgramEntity,
        organizations: {
          disconnect: deleteOrganizationIds.map((id) => ({ id })),
          connect: addOrganizationIds.map((id) => ({ id })),
        },
      },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }
}
