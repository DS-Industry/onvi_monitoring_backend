import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingResponseDto } from '@organization/organization/use-cases/dto/organization-get-rating-response.dto';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';

@Injectable()
export class GetRatingOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
  ): Promise<OrganizationGetRatingResponseDto[]> {
    const operations =
      await this.findMethodsDeviceOperationUseCase.getAllByFilter({
        ability: ability,
        dateStart: dateStart,
        dateEnd: dateEnd,
      });
    const posStatsMap = operations.reduce((acc, operation) => {
      const posKey = `${operation.posId}`;
      if (!acc.has(posKey)) {
        acc.set(posKey, {
          posName: operation.posName,
          sum: 0,
        });
      }

      acc.get(posKey)!.sum += operation.operSum;
      return acc;
    }, new Map<string, { posName: string; sum: number }>());
    return Array.from(posStatsMap.values())
      .map((item) => ({
        posName: item.posName,
        sum: item.sum,
      }))
      .sort((a, b) => b.sum - a.sum);
  }
}
