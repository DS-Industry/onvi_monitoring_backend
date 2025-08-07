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
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';
import { MonthlyPlanPos } from '@pos/monthlyPlanPos/domain/monthlyPlanPos';

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

    const allOperations =
      await this.findMethodsDeviceOperationUseCase.getAllByFilter({
        posIds: posIds,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
      });

    const operationsByPos = this.groupOperationsByPos(allOperations);

    const adjustedDateStart = this.getFirstDayOfMonth(data.dateStart);
    const adjustedDateEnd = this.getLastDayOfMonth(data.dateEnd);
    const allPlans =
      await this.findMethodsMonthlyPlanPosUseCase.getAllByPosIdsAndDate(
        posIds,
        adjustedDateStart,
        adjustedDateEnd,
      );

    const response: PosPlanFactDto[] = [];
    for (const posId of posIds) {
      const posOperations = operationsByPos.get(posId) || [];
      const posPlans = allPlans.filter((plan) => plan.posId === posId);

      const sums = this.calculateSumsByCurrency(posOperations);

      const totalPlan = this.calculateTotalPlan(
        posPlans,
        data.dateStart,
        data.dateEnd,
      );

      const sumFact = sums.cashSum + sums.virtualSum + sums.yandexSum;
      const completedPercent =
        totalPlan > 0 ? Math.round((sumFact / totalPlan) * 100) : 100;

      response.push({
        posId: posId,
        plan: totalPlan,
        cashFact: sums.cashSum,
        virtualSumFact: sums.virtualSum,
        yandexSumFact: sums.yandexSum,
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
      await this.findMethodsPosUseCase.countAllByAbilityAndPlacement(
        data.ability,
        data.placementId,
      );

    const poses = await this.findMethodsPosUseCase.getAllByFilter({
      ability: data.ability,
      placementId: data.placementId,
      skip: data.skip,
      take: data.take,
    });

    return {
      posIds: poses.map((pos) => pos.id),
      totalCount,
    };
  }

  private groupOperationsByPos(
    operations: DeviceOperationFullDataResponseDto[],
  ): Map<number, DeviceOperationFullDataResponseDto[]> {
    return operations.reduce((map, operation) => {
      const posId = operation.posId;
      if (!map.has(posId)) {
        map.set(posId, []);
      }
      map.get(posId).push(operation);
      return map;
    }, new Map<number, DeviceOperationFullDataResponseDto[]>());
  }

  private calculateSumsByCurrency(
    operations: DeviceOperationFullDataResponseDto[],
  ): { cashSum: number; virtualSum: number; yandexSum: number } {
    return operations.reduce(
      (acc, operation) => {
        const sum = operation.operSum;
        switch (operation.currencyType) {
          case CurrencyType.CASH:
            acc.cashSum += sum;
            break;
          case CurrencyType.CASHLESS:
            acc.virtualSum += sum;
            break;
          case CurrencyType.VIRTUAL:
            acc.yandexSum += sum;
            break;
        }
        return acc;
      },
      { cashSum: 0, virtualSum: 0, yandexSum: 0 },
    );
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
