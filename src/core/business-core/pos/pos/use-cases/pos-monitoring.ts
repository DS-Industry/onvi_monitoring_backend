import { Injectable } from '@nestjs/common';
import {
  PosMonitoringDto,
  PosMonitoringResponseDto,
} from '@platform-user/core-controller/dto/response/pos-monitoring-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { DeviceOperationMonitoringResponseDto } from '@pos/device/device-data/device-data/device-operation/use-cases/dto/device-operation-monitoring-response.dto';

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
    const posIds = posData.map((pos) => pos.id);

    const [operations, lastOpers] = await Promise.all([
      this.findMethodsDeviceOperationUseCase.getDataByMonitoring(
        posIds,
        data.dateStart,
        data.dateEnd,
      ),
      this.findMethodsDeviceOperationUseCase.getDataLastOperByPosIds(posIds),
    ]);

    const operationsMap = new Map<
      number,
      DeviceOperationMonitoringResponseDto
    >();
    operations.forEach((op) => operationsMap.set(op.ownerId, op));

    const lastDatesMap = lastOpers.reduce((map, item) => {
      map.set(item.ownerId, item.operDate);
      return map;
    }, new Map<number, Date>());

    const response: PosMonitoringDto[] = [];

    for (const pos of posData) {
      const posOperations = operationsMap.get(pos.id);

      response.push({
        id: pos.id,
        name: pos.name,
        city: pos.city,
        counter: posOperations?.counter,
        cashSum: posOperations?.cashSum,
        virtualSum: posOperations?.virtualSum,
        yandexSum: posOperations?.yandexSum,
        mobileSum: 0,
        cardSum: 0,
        lastOper: lastDatesMap.get(pos.id) || undefined,
        discountSum: 0,
        cashbackSumCard: 0,
        cashbackSumMub: 0,
      });
    }

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
}
