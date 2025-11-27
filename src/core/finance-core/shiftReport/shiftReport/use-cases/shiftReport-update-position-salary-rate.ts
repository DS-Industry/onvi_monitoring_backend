import { Injectable } from '@nestjs/common';
import { PosPositionSalaryRateUpdateDto } from '@platform-user/core-controller/dto/receive/pos-position-salary-rate-update.dto';
import { IPosPositionSalaryRateRepository } from '@finance/shiftReport/posPositionSalaryRate/interface/posPositionSalaryRate';
import { PosPositionSalaryRate } from '@finance/shiftReport/posPositionSalaryRate/domain/posPositionSalaryRate';

@Injectable()
export class UpdatePositionSalaryRateUseCase {
  constructor(
    private readonly posPositionSalaryRateRepository: IPosPositionSalaryRateRepository,
  ) {}

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
    const existingRate =
      await this.posPositionSalaryRateRepository.findOneByPosIdAndHrPositionId(
        data.posId,
        data.hrPositionId,
      );

    const salaryRate = new PosPositionSalaryRate({
      posId: data.posId,
      hrPositionId: data.hrPositionId,
      baseRateDay:
        data.baseRateDay !== undefined
          ? data.baseRateDay ?? null
          : existingRate?.baseRateDay ?? null,
      bonusRateDay:
        data.bonusRateDay !== undefined
          ? data.bonusRateDay ?? null
          : existingRate?.bonusRateDay ?? null,
      baseRateNight:
        data.baseRateNight !== undefined
          ? data.baseRateNight ?? null
          : existingRate?.baseRateNight ?? null,
      bonusRateNight:
        data.bonusRateNight !== undefined
          ? data.bonusRateNight ?? null
          : existingRate?.bonusRateNight ?? null,
    });

    const updatedSalaryRate = await this.posPositionSalaryRateRepository.upsert(
      salaryRate,
    );

    return {
      id: updatedSalaryRate.id,
      posId: updatedSalaryRate.posId,
      hrPositionId: updatedSalaryRate.hrPositionId,
      baseRateDay: updatedSalaryRate.baseRateDay,
      bonusRateDay: updatedSalaryRate.bonusRateDay,
      baseRateNight: updatedSalaryRate.baseRateNight,
      bonusRateNight: updatedSalaryRate.bonusRateNight,
    };
  }
}

