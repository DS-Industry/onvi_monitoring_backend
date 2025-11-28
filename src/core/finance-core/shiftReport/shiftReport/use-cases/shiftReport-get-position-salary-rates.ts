import { Injectable } from '@nestjs/common';
import { FindMethodsPositionUseCase } from '@hr/position/use-case/position-find-methods';
import { IPosPositionSalaryRateRepository } from '@finance/shiftReport/posPositionSalaryRate/interface/posPositionSalaryRate';

export interface PositionSalaryRateDto {
  hrPositionId: number;
  hrPositionName: string;
  baseRateDay?: number | null;
  bonusRateDay?: number | null;
  baseRateNight?: number | null;
  bonusRateNight?: number | null;
}

@Injectable()
export class GetPositionSalaryRatesUseCase {
  constructor(
    private readonly posPositionSalaryRateRepository: IPosPositionSalaryRateRepository,
    private readonly findMethodsPositionUseCase: FindMethodsPositionUseCase,
  ) {}

  async execute(posId: number, organizationId: number): Promise<PositionSalaryRateDto[]> {
    const positions = await this.findMethodsPositionUseCase.getAllByOrgId(organizationId);

    const salaryRates = await this.posPositionSalaryRateRepository.findAllByPosId(posId);

    const salaryRateMap = new Map<number, typeof salaryRates[0]>();
    salaryRates.forEach((rate) => {
      salaryRateMap.set(rate.hrPositionId, rate);
    });

    return positions.map((position) => {
      const salaryRate = salaryRateMap.get(position.id);
      return {
        hrPositionId: position.id,
        hrPositionName: position.name,
        baseRateDay: salaryRate?.baseRateDay ?? null,
        bonusRateDay: salaryRate?.bonusRateDay ?? null,
        baseRateNight: salaryRate?.baseRateNight ?? null,
        bonusRateNight: salaryRate?.bonusRateNight ?? null,
      };
    });
  }
}

