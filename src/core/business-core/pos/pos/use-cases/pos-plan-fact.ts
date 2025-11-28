import { Injectable } from '@nestjs/common';
import { Pos } from '@pos/pos/domain/pos';
import {
  PosPlanFactDto,
  PosPlanFactResponseDto,
} from '@platform-user/core-controller/dto/response/pos-plan-fact-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { FindMethodsMonthlyPlanPosUseCase } from '@pos/monthlyPlanPos/use-cases/monthlyPlanPos-find-methods';
import { MonthlyPlanPos } from '@pos/monthlyPlanPos/domain/monthlyPlanPos';
import { DeviceOperationMonitoringResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto';

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
    placementId?: number;
    pos?: Pos;
    skip?: number;
    take?: number;
  }): Promise<PosPlanFactResponseDto> {
    const { posIds, totalCount } = await this.getPosData(data);

    const adjustedDateStart = this.getFirstDayOfMonth(data.dateStart);
    const adjustedDateEnd = this.getLastDayOfMonth(data.dateEnd);

    const [operations, allPlans] = await Promise.all([
      this.findMethodsDeviceOperationUseCase.getDataByMonitoring(
        posIds,
        data.dateStart,
        data.dateEnd,
      ),
      this.findMethodsMonthlyPlanPosUseCase.getAllByPosIdsAndDate(
        posIds,
        adjustedDateStart,
        adjustedDateEnd,
      ),
    ]);

    const operationsMap = new Map<
      number,
      DeviceOperationMonitoringResponseDto
    >();
    operations.forEach((op) => operationsMap.set(op.ownerId, op));

    const response: PosPlanFactDto[] = [];
    for (const posId of posIds) {
      const posOperations = operationsMap.get(posId);
      const posPlans = allPlans.filter((plan) => plan.posId === posId);

      const cashSum = posOperations?.cashSum || 0;
      const virtualSum = posOperations?.virtualSum || 0;
      const yandexSum = posOperations?.yandexSum || 0;
      const sumFact = cashSum + virtualSum + yandexSum;

      const totalPlan = this.calculateTotalPlan(
        posPlans,
        data.dateStart,
        data.dateEnd,
      );
      const completedPercent =
        totalPlan > 0 ? Math.round((sumFact / totalPlan) * 100) : 100;

      response.push({
        posId: posId,
        plan: totalPlan,
        cashFact: cashSum,
        virtualSumFact: virtualSum,
        yandexSumFact: yandexSum,
        sumFact: sumFact,
        completedPercent: completedPercent,
        notCompletedPercent:
          completedPercent >= 100 ? 0 : 100 - completedPercent,
      });
    }

    return { plan: response, totalCount: totalCount };
  }

  private async getPosData(data: {
    pos?: Pos;
    ability: any;
    placementId?: number;
    skip?: number;
    take?: number;
  }): Promise<{ posIds: number[]; totalCount: number }> {
    if (data.pos) {
      return {
        posIds: [data.pos.id],
        totalCount: 1,
      };
    }

    const totalCount =
      await this.findMethodsPosUseCase.countAllByAbilityAndPlacement({
        ability: data.ability,
        placementId: data.placementId,
      });

    const posIds = data.ability.rules
      .filter(
        (rule: {
          subject: string;
          action: string;
          conditions: { id: { in: any } };
        }) =>
          (rule.action === 'read' || rule.action === 'manage') &&
          rule.subject === 'Pos' &&
          rule.conditions?.id?.in,
      )
      .flatMap(
        (rule: { conditions: { id: { in: any } } }) => rule.conditions.id.in,
      );

    return {
      posIds,
      totalCount,
    };
  }

  private calculateTotalPlan(
    plans: MonthlyPlanPos[],
    dateStart: Date,
    dateEnd: Date,
  ): number {
    return plans.reduce((total, plan) => {
      const planStart = new Date(plan.monthDate);
      const planEnd = new Date(
        planStart.getFullYear(),
        planStart.getMonth() + 1,
        0,
      );

      const periodStart = dateStart > planStart ? dateStart : planStart;
      const periodEnd = dateEnd < planEnd ? dateEnd : planEnd;

      const planDays =
        (planEnd.getTime() - planStart.getTime()) / (1000 * 3600 * 24);
      const periodDays =
        (periodEnd.getTime() - periodStart.getTime()) / (1000 * 3600 * 24);

      const planRatio = periodDays / planDays;
      return total + Math.round(plan.monthlyPlan * planRatio);
    }, 0);
  }

  private getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  private getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 2);
  }
}
