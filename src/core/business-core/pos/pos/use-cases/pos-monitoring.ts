import { Injectable } from '@nestjs/common';
import pLimit from 'p-limit';
import {
  PosMonitoringDto,
  PosMonitoringResponseDto,
} from '@platform-user/core-controller/dto/response/pos-monitoring-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { CurrencyType } from '@prisma/client';
import { DeviceOperationFullDataResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-full-data-response.dto';

@Injectable()
export class MonitoringPosUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(data: {
    dateStart: Date;
    dateEnd: Date;
    ability: any;
    placementId?: number;
    pos?: Pos;
    skip?: number;
    take?: number;
  }): Promise<PosMonitoringResponseDto> {
    const { posData, totalCount } = await this.getPosData(data);

    const allOperations =
      await this.findMethodsDeviceOperationUseCase.getAllByFilter({
        posId: data.pos?.id,
        ability: data.pos ? undefined : data.ability,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
      });

    const operationsByPos = this.groupOperationsByPos(allOperations);

    const response = await this.processPosData(posData, operationsByPos);

    return {
      oper: response,
      totalCount: totalCount,
    };
  }

  private async getPosData(data: {
    pos?: Pos;
    ability: any;
    placementId?: number;
    skip?: number;
    take?: number;
  }): Promise<{
    posData: { id: number; name: string; city: string }[];
    totalCount: number;
  }> {
    if (data.pos) {
      return {
        posData: [
          {
            id: data.pos.id,
            name: data.pos.name,
            city: data.pos.address.city,
          },
        ],
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
      posData: poses.map((pos) => ({
        id: pos.id,
        name: pos.name,
        city: pos.address.city,
      })),
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
      map.get(posId)!.push(operation);
      return map;
    }, new Map<number, DeviceOperationFullDataResponseDto[]>());
  }

  private async processPosData(
    posData: { id: number; name: string; city: string }[],
    operationsByPos: Map<number, DeviceOperationFullDataResponseDto[]>,
  ): Promise<PosMonitoringDto[]> {
    const response: PosMonitoringDto[] = [];
    const limit = pLimit(10);

    for (const pos of posData) {
      const posOperations = operationsByPos.get(pos.id) || [];

      const lastOper = await limit(() =>
        this.findMethodsDeviceOperationUseCase.getLastByPosIdUseCase(pos.id),
      );

      const sums = this.calculateSumsByCurrency(posOperations);

      response.push({
        id: pos.id,
        name: pos.name,
        city: pos.city,
        counter: posOperations.length,
        ...sums,
        mobileSum: 0,
        cardSum: 0,
        lastOper: lastOper?.operDate,
        discountSum: 0,
        cashbackSumCard: 0,
        cashbackSumMub: 0,
      });
    }

    return response;
  }

  private calculateSumsByCurrency(
    operations: DeviceOperationFullDataResponseDto[],
  ): {
    cashSum: number;
    virtualSum: number;
    yandexSum: number;
  } {
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
}
