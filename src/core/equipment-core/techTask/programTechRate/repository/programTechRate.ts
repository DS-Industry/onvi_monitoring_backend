import { Injectable } from '@nestjs/common';
import { IProgramTechRateRepository } from '@tech-task/programTechRate/interface/programTechRate';
import { PrismaService } from '@db/prisma/prisma.service';
import { ProgramTechRate } from '@tech-task/programTechRate/domain/programTechRate';
import { PrismaProgramTechRateMapper } from '@db/mapper/prisma-program-tech-rate-mapper';

@Injectable()
export class ProgramTechRateRepository extends IProgramTechRateRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: ProgramTechRate): Promise<ProgramTechRate> {
    const programTechRateEntity = PrismaProgramTechRateMapper.toPrisma(input);
    const programTechRate = await this.prisma.programTechRate.create({
      data: programTechRateEntity,
    });
    return PrismaProgramTechRateMapper.toDomain(programTechRate);
  }

  public async findOneById(id: number): Promise<ProgramTechRate> {
    const programTechRate = await this.prisma.programTechRate.findFirst({
      where: {
        id,
      },
    });
    return PrismaProgramTechRateMapper.toDomain(programTechRate);
  }

  public async findOneByCWPosIdAndProgramTypeId(
    carWashPosId: number,
    carWashDeviceProgramsTypeId: number,
  ): Promise<ProgramTechRate> {
    const programTechRate = await this.prisma.programTechRate.findFirst({
      where: {
        carWashPosId,
        carWashDeviceProgramsTypeId,
      },
    });
    return PrismaProgramTechRateMapper.toDomain(programTechRate);
  }

  public async findOneByCWPosIdAndProgramTypeCode(
    carWashPosId: number,
    carWashDeviceProgramsTypeCode: string,
  ): Promise<ProgramTechRate> {
    const programTechRate = await this.prisma.programTechRate.findFirst({
      where: {
        carWashPosId,
        carWashDeviceProgramsType: { code: carWashDeviceProgramsTypeCode },
      },
    });
    return PrismaProgramTechRateMapper.toDomain(programTechRate);
  }

  public async update(input: ProgramTechRate): Promise<ProgramTechRate> {
    const programTechRateEntity = PrismaProgramTechRateMapper.toPrisma(input);
    const programTechRate = await this.prisma.programTechRate.update({
      where: {
        id: input.id,
      },
      data: programTechRateEntity,
    });
    return PrismaProgramTechRateMapper.toDomain(programTechRate);
  }

  public async updateValue(
    id: number,
    literRate?: number,
    concentration?: number,
  ): Promise<ProgramTechRate> {
    const programTechRate = await this.prisma.programTechRate.update({
      where: {
        id: id,
      },
      data: { literRate: literRate, concentration: concentration },
    });
    return PrismaProgramTechRateMapper.toDomain(programTechRate);
  }

  public async findAllByPosId(posId: number): Promise<ProgramTechRate[]> {
    const programTechRates = await this.prisma.programTechRate.findMany({
      where: {
        carWashPos: {
          posId: posId,
        },
      },
    });
    return programTechRates.map((item) =>
      PrismaProgramTechRateMapper.toDomain(item),
    );
  }
}
