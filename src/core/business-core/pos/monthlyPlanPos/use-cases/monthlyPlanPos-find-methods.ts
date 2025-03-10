import { Injectable } from '@nestjs/common';
import { IMonthlyPlanPosRepository } from '@pos/monthlyPlanPos/interface/monthlyPlanPos';
import { MonthlyPlanPos } from '@pos/monthlyPlanPos/domain/monthlyPlanPos';

@Injectable()
export class FindMethodsMonthlyPlanPosUseCase {
  constructor(
    private readonly monthlyPlanPosRepository: IMonthlyPlanPosRepository,
  ) {}

  async getOneById(input: number): Promise<MonthlyPlanPos> {
    return await this.monthlyPlanPosRepository.findOneById(input);
  }

  async getAllByPosId(posId: number): Promise<MonthlyPlanPos[]> {
    return await this.monthlyPlanPosRepository.findAllByPosId(posId);
  }

  async getAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<MonthlyPlanPos[]> {
    return await this.monthlyPlanPosRepository.findAllByPosIdAndDate(
      posId,
      dateStart,
      dateEnd,
    );
  }
}
