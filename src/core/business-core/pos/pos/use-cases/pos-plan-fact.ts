import { Injectable } from '@nestjs/common';
import { Pos } from '@pos/pos/domain/pos';
import { PosPlanFactResponseDto } from '@platform-user/core-controller/dto/response/pos-plan-fact-response.dto';
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

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
    placementId: number | '*',
    pos?: Pos,
  ): Promise<PosPlanFactResponseDto[]> {
    const response: PosPlanFactResponseDto[] = [];
    let poses: Pos[] = [];
    if (pos) {
      poses.push(pos);
    } else {
      poses = await this.findMethodsPosUseCase.getAllByAbilityPos(
        ability,
        placementId,
      );
    }

    const adjustedDateStart = this.getFirstDayOfMonth(dateStart);
    const adjustedDateEnd = this.getLastDayOfMonth(dateEnd);

    const cashSumMap = new Map<number, number>();
    const virtualSumMap = new Map<number, number>();
    const yandexSumMap = new Map<number, number>();

    await Promise.all(
      poses.map(async (pos) => {
        const posOperations =
          await this.findMethodsDeviceOperationUseCase.getAllByPosIdAndDateUseCase(
            pos.id,
            dateStart,
            dateEnd,
          );
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
          const periodStart = dateStart > planStart ? dateStart : planStart;
          const periodEnd = dateEnd < planEnd ? dateEnd : planEnd;

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
          totalPlan > 0 ? (sumFact / totalPlan) * 100 : 100;
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

    return response;
  }

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  private getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 2);
  }
}
