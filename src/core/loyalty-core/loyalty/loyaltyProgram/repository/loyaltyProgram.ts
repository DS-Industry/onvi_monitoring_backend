import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { PrismaService } from '@db/prisma/prisma.service';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { PrismaLoyaltyProgramMapper } from '@db/mapper/prisma-loyalty-program-mapper';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class LoyaltyProgramRepository extends ILoyaltyProgramRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: LTYProgram,
    ownerOrganizationId: number,
  ): Promise<LTYProgram> {
    const LoyaltyProgramEntity = PrismaLoyaltyProgramMapper.toPrisma(input);
    
    const loyaltyProgram = await this.prisma.$transaction(async (tx) => {
      const createdProgram = await tx.lTYProgram.create({
        data: {
          ...LoyaltyProgramEntity,
          ownerOrganization: { connect: { id: ownerOrganizationId } },
        },
      });

      await tx.lTYProgramParticipant.create({
        data: {
          ltyProgramId: createdProgram.id,
          organizationId: ownerOrganizationId,
          status: 'ACTIVE',
        },
      });

      return createdProgram;
    });

    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findOneById(id: number): Promise<LTYProgram> {
    const loyaltyProgram = await this.prisma.lTYProgram.findFirst({
      where: { id },
      include: {
        hubRequest: true
      }
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findOneByOrganizationId(
    organizationId: number,
  ): Promise<LTYProgram> {
    const loyaltyProgram = await this.prisma.lTYProgram.findFirst({
      where: {
        programParticipants: {
          some: {
            organizationId: organizationId,
            status: 'ACTIVE',
          },
        },
      },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findOneByOwnerOrganizationId(
    ownerOrganizationId: number,
  ): Promise<LTYProgram> {
    const loyaltyProgram = await this.prisma.lTYProgram.findFirst({
      where: {
        ownerOrganizationId: ownerOrganizationId,
      },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findOneByCardTierId(
    cardTierId: number,
  ): Promise<LTYProgram> {
    const loyaltyProgram = await this.prisma.lTYProgram.findFirst({
      where: {
        cardTiers: {
          some: {
            id: cardTierId,
          },
        },
      },
    });
    return PrismaLoyaltyProgramMapper.toDomain(loyaltyProgram);
  }

  public async findAll(): Promise<LTYProgram[]> {
    const loyaltyPrograms = await this.prisma.lTYProgram.findMany();
    return loyaltyPrograms.map((item) =>
      PrismaLoyaltyProgramMapper.toDomain(item),
    );
  }

  public async findAllByPermission(
    ability: any,
    organizationId?: number,
  ): Promise<LTYProgram[]> {
    const where: any = {};

    if (organizationId !== undefined) {
      where.programParticipants = {
        some: {
          organizationId: organizationId,
          status: 'ACTIVE',
        },
      };
    }

    const finalWhere = ability
      ? {
          AND: [accessibleBy(ability).LTYProgram, where],
        }
      : where;

    const loyaltyPrograms = await this.prisma.lTYProgram.findMany({
      where: finalWhere,
    });
    return loyaltyPrograms.map((item) =>
      PrismaLoyaltyProgramMapper.toDomain(item),
    );
  }

  public async findAllByUserId(userId: number): Promise<LTYProgram[]> {
    const loyaltyPrograms = await this.prisma.lTYProgram.findMany({
      where: {
        programParticipants: {
          some: {
            organization: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
            status: 'ACTIVE',
          },
        },
      },
    });
    return loyaltyPrograms.map((item) =>
      PrismaLoyaltyProgramMapper.toDomain(item),
    );
  }

  public async update(
    input: LTYProgram,
  ): Promise<LTYProgram> {
    const LoyaltyProgramEntity = PrismaLoyaltyProgramMapper.toPrisma(input);
    
    const updatedProgram = await this.prisma.lTYProgram.update({
      where: {
        id: input.id,
      },
      data: LoyaltyProgramEntity,
    });

    return PrismaLoyaltyProgramMapper.toDomain(updatedProgram);
  }
}
