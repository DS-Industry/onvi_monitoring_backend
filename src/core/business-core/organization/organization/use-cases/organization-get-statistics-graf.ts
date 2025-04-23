import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';
import { OrganizationStatisticGrafResponseDto } from '@platform-user/core-controller/dto/response/organization-statistic-graf-response.dto';

@Injectable()
export class GetStatisticsGrafOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
  ): Promise<OrganizationStatisticGrafResponseDto[]> {
    const poses = await this.findMethodsPosUseCase.getAllByAbilityPos(ability);

    const allOperations = await Promise.all(
      poses.map(async (pos) => {
        return this.findMethodsDeviceOperationUseCase.getAllByPosIdAndDateUseCase(
          pos.id,
          dateStart,
          dateEnd,
        );
      }),
    );

    const flattenedOperations = allOperations.flat();
    const operationsByMonth = new Map<
      string,
      { year: number; month: number; sum: number }
    >();
    flattenedOperations.forEach((operation) => {
      const date = new Date(operation.operDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      if (!operationsByMonth.has(key)) {
        operationsByMonth.set(key, { year, month, sum: 0 });
      }
      operationsByMonth.get(key)!.sum += operation.operSum;
    });

    return Array.from(operationsByMonth.values())
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map((item) => ({
        date: new Date(Date.UTC(item.year, item.month, 1)),
        sum: item.sum,
      }));
  }
}
