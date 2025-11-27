import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { PosPositionSalaryRateUpdateDto } from '@platform-user/core-controller/dto/receive/pos-position-salary-rate-update.dto';

@Injectable()
export class UpdatePositionSalaryRateUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    data: PosPositionSalaryRateUpdateDto,
  ): Promise<{
    id: number;
    posId: number;
    hrPositionId: number;
    baseRateDay: number | null;
    bonusRateDay: number | null;
    baseRateNight: number | null;
    bonusRateNight: number | null;
  }> {
    const salaryRate = await this.prisma.posPositionSalaryRate.upsert({
      where: {
        posId_hrPositionId: {
          posId: data.posId,
          hrPositionId: data.hrPositionId,
        },
      },
      create: {
        posId: data.posId,
        hrPositionId: data.hrPositionId,
        baseRateDay: data.baseRateDay ?? null,
        bonusRateDay: data.bonusRateDay ?? null,
        baseRateNight: data.baseRateNight ?? null,
        bonusRateNight: data.bonusRateNight ?? null,
      },
      update: {
        baseRateDay: data.baseRateDay ?? null,
        bonusRateDay: data.bonusRateDay ?? null,
        baseRateNight: data.baseRateNight ?? null,
        bonusRateNight: data.bonusRateNight ?? null,
      },
    });

    return {
      id: salaryRate.id,
      posId: salaryRate.posId,
      hrPositionId: salaryRate.hrPositionId,
      baseRateDay: salaryRate.baseRateDay,
      bonusRateDay: salaryRate.bonusRateDay,
      baseRateNight: salaryRate.baseRateNight,
      bonusRateNight: salaryRate.bonusRateNight,
    };
  }
}

