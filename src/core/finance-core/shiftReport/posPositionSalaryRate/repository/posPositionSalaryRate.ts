import { Injectable } from '@nestjs/common';
import { IPosPositionSalaryRateRepository } from '@finance/shiftReport/posPositionSalaryRate/interface/posPositionSalaryRate';
import { PrismaService } from '@db/prisma/prisma.service';
import { PosPositionSalaryRate } from '@finance/shiftReport/posPositionSalaryRate/domain/posPositionSalaryRate';
import { PrismaPosPositionSalaryRateMapper } from '@db/mapper/prisma-pos-position-salary-rate-mapper';

@Injectable()
export class PosPositionSalaryRateRepository extends IPosPositionSalaryRateRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOneByPosIdAndHrPositionId(
    posId: number,
    hrPositionId: number,
  ): Promise<PosPositionSalaryRate | null> {
    const salaryRate = await this.prisma.posPositionSalaryRate.findFirst({
      where: {
        posId,
        hrPositionId,
      },
    });
    return PrismaPosPositionSalaryRateMapper.toDomain(salaryRate);
  }

  async findAllByPosId(posId: number): Promise<PosPositionSalaryRate[]> {
    const salaryRates = await this.prisma.posPositionSalaryRate.findMany({
      where: {
        posId,
      },
    });
    return salaryRates
      .map((rate) => PrismaPosPositionSalaryRateMapper.toDomain(rate))
      .filter((rate): rate is PosPositionSalaryRate => rate !== null);
  }

  async upsert(input: PosPositionSalaryRate): Promise<PosPositionSalaryRate> {
    const salaryRatePrisma = PrismaPosPositionSalaryRateMapper.toPrisma(input);
    const salaryRate = await this.prisma.posPositionSalaryRate.upsert({
      where: {
        posId_hrPositionId: {
          posId: input.posId,
          hrPositionId: input.hrPositionId,
        },
      },
      create: salaryRatePrisma,
      update: {
        baseRateDay: salaryRatePrisma.baseRateDay,
        bonusRateDay: salaryRatePrisma.bonusRateDay,
        baseRateNight: salaryRatePrisma.baseRateNight,
        bonusRateNight: salaryRatePrisma.bonusRateNight,
      },
    });
    return PrismaPosPositionSalaryRateMapper.toDomain(salaryRate);
  }
}

