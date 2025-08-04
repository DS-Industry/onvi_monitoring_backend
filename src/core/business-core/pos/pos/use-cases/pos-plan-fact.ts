import { Injectable } from '@nestjs/common';
import { Pos } from '@pos/pos/domain/pos';
import {
  PosPlanFactDto,
  PosPlanFactResponseDto,
} from '@platform-user/core-controller/dto/response/pos-plan-fact-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { CurrencyType } from '@prisma/client';
import { FindMethodsMonthlyPlanPosUseCase } from '@pos/monthlyPlanPos/use-cases/monthlyPlanPos-find-methods';

@Injectable()
export class PlanFactPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsMonthlyPlanPosUseCase: FindMethodsMonthlyPlanPosUseCase,
  ) {}

  async execute(data: {
    dateStart: Date;
    dateEnd: Date;
    ability: any;
    placementId: number | '*';
    pos?: Pos;
    skip?: number;
    take?: number;
  }): Promise<PosPlanFactResponseDto> {
    const response: PosPlanFactDto[] = [];
    let poses: Pos[] = [];
    let totalCount = 1;
    if (data.pos) {
      poses.push(data.pos);
    } else {
      totalCount =
        await this.findMethodsPosUseCase.countAllByAbilityAndPlacement(
          data.ability,
          data.placementId,
        );
      poses = await this.findMethodsPosUseCase.getAllByAbilityPos(
        data.ability,
        data.placementId,
        data.skip,
        data.take,
      );
    }

    const adjustedDateStart = this.getFirstDayOfMonth(data.dateStart);
    const adjustedDateEnd = this.getLastDayOfMonth(data.dateEnd);

    const cashSumMap = new Map<number, number>();
    const virtualSumMap = new Map<number, number>();
    const yandexSumMap = new Map<number, number>();

    await Promise.all(
      poses.map(async (pos) => {
        const posOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByFilter({
            posId: pos.id,
            dateStart: data.dateStart,
            dateEnd: data.dateEnd,
          });
        await Promise.all(
          posOperations.map(async (posOperation) => {
            const operSum = posOperation.operSum;
            const posId = pos.id;

            if (posOperation.currencyType == CurrencyType.CASH) {
              cashSumMap.set(posId, (cashSumMap.get(posId) || 0) + operSum);
            } else if (posOperation.currencyType == CurrencyType.CASHLESS) {
              virtualSumMap.set(
                posId,
                (virtualSumMap.get(posId) || 0) + operSum,
              );
            } else if (posOperation.currencyType == CurrencyType.VIRTUAL) {
              yandexSumMap.set(posId, (yandexSumMap.get(posId) || 0) + operSum);
            }
          }),
        );

        const plans =
          await this.findMethodsMonthlyPlanPosUseCase.getAllByPosIdAndDate(
            pos.id,
            adjustedDateStart,
            adjustedDateEnd,
          );
        let totalPlan = 0;
        plans.forEach((plan) => {
          const planStart = new Date(plan.monthDate);
          const planEnd = new Date(
            planStart.getFullYear(),
            planStart.getMonth() + 1,
            0,
          ); // Конец месяца

          // Определяем пересечение плана с указанным периодом
          const periodStart =
            data.dateStart > planStart ? data.dateStart : planStart;
          const periodEnd = data.dateEnd < planEnd ? data.dateEnd : planEnd;

          // Количество дней в плане и в периоде
          const planDays =
            (planEnd.getTime() - planStart.getTime()) / (1000 * 3600 * 24);
          const periodDays =
            (periodEnd.getTime() - periodStart.getTime()) / (1000 * 3600 * 24);

          // Доля плана, которая приходится на указанный период
          const planRatio = periodDays / planDays;
          totalPlan += plan.monthlyPlan * planRatio;
        });

        totalPlan = Math.round(totalPlan);

        const cashFact = cashSumMap.get(pos.id) || 0;
        const virtualSumFact = virtualSumMap.get(pos.id) || 0;
        const yandexSumFact = yandexSumMap.get(pos.id) || 0;

        const sumFact = cashFact + virtualSumFact + yandexSumFact;

        const completedPercent =
          totalPlan > 0 ? Math.round((sumFact / totalPlan) * 100) : 100;
        const notCompletedPercent =
          completedPercent >= 100 ? 0 : 100 - completedPercent;

        response.push({
          posId: pos.id,
          plan: totalPlan,
          cashFact,
          virtualSumFact,
          yandexSumFact,
          sumFact,
          completedPercent,
          notCompletedPercent,
        });
      }),
    );

    return { plan: response, totalCount: totalCount };
  }

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  private getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 2);
  }
}
