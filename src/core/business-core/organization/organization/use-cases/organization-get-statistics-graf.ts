import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { OrganizationStatisticGrafResponseDto } from '@platform-user/core-controller/dto/response/organization-statistic-graf-response.dto';

@Injectable()
export class GetStatisticsGrafOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
  ): Promise<OrganizationStatisticGrafResponseDto[]> {
    const operations =
      await this.findMethodsDeviceOperationUseCase.getAllByFilter({
        ability: ability,
        dateStart: dateStart,
        dateEnd: dateEnd,
      });

    const operationsByDay = operations.reduce((acc, operation) => {
      const date = new Date(operation.operDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const key = `${year}-${month}-${day}`;

      if (!acc.has(key)) {
        acc.set(key, {
          year,
          month,
          day,
          sum: 0,
        });
      }

      acc.get(key)!.sum += operation.operSum;
      return acc;
    }, new Map<string, { year: number; month: number; day: number; sum: number }>());

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
