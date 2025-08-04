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
        return this.findMethodsDeviceOperationUseCase.getAllByFilter({
          ability: ability,
          dateStart: dateStart,
          dateEnd: dateEnd,
        });
      }),
    );

    const flattenedOperations = allOperations.flat();
    const operationsByDay = new Map<
      string,
      { year: number; month: number; day: number; sum: number }
    >();
    flattenedOperations.forEach((operation) => {
      const date = new Date(operation.operDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const key = `${year}-${month}-${day}`;
      if (!operationsByDay.has(key)) {
        operationsByDay.set(key, { year, month, day, sum: 0 });
      }
      operationsByDay.get(key)!.sum += operation.operSum;
    });

    return Array.from(operationsByDay.values())
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
      })
      .map((item) => ({
        date: new Date(Date.UTC(item.year, item.month, item.day)),
        sum: item.sum,
      }));
  }
}
