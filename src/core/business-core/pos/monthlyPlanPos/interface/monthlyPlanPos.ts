import { MonthlyPlanPos } from '@pos/monthlyPlanPos/domain/monthlyPlanPos';

export abstract class IMonthlyPlanPosRepository {
  abstract create(input: MonthlyPlanPos): Promise<MonthlyPlanPos>;
  abstract findOneById(id: number): Promise<MonthlyPlanPos>;
  abstract findAllByPosId(posId: number): Promise<MonthlyPlanPos[]>;
  abstract findAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<MonthlyPlanPos[]>;
  abstract update(input: MonthlyPlanPos): Promise<MonthlyPlanPos>;
}
