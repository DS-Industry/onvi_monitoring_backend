import { Injectable } from '@nestjs/common';
import {
  CashCollectionsDataResponseDto,
  CashCollectionsResponseDto,
} from '@platform-user/core-controller/dto/response/cash-collections-response.dto';
import { FindMethodsCashCollectionUseCase } from '@finance/cashCollection/cashCollection/use-cases/cashCollection-find-methods';
import { FindMethodsCashCollectionTypeUseCase } from '@finance/cashCollection/cashCollectionDeviceType/use-cases/cashCollectionType-find-methods';

@Injectable()
export class GetAllByFilterCashCollectionUseCase {
  constructor(
    private readonly findMethodsCashCollectionUseCase: FindMethodsCashCollectionUseCase,
    private readonly findMethodsCashCollectionTypeUseCase: FindMethodsCashCollectionTypeUseCase,
  ) {}

  async execute(
    posIds: number[],
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<CashCollectionsResponseDto> {
    const [count, cashCollections] = await Promise.all([
      this.findMethodsCashCollectionUseCase.getCountAllByPosIdsAndDate(
        posIds,
        dateStart,
        dateEnd,
      ),
      this.findMethodsCashCollectionUseCase.getAllByPosIdsAndDate(
        posIds,
        dateStart,
        dateEnd,
        skip,
        take,
      ),
    ]);

    const response: CashCollectionsDataResponseDto[] = [];
    for (const cashCollection of cashCollections) {
      const cashCollectionDeviceTypes =
        await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
          cashCollection.id,
        );

      const typeResponse = cashCollectionDeviceTypes.map((type) => ({
        typeName: type.carWashDeviceTypeName,
        typeShortage: type.shortage,
      }));

      response.push({
        id: cashCollection.id,
        posId: cashCollection.posId,
        period: `${cashCollection.oldCashCollectionDate.toString()}-${cashCollection.cashCollectionDate.toString()}`,
        sumFact: cashCollection.sumFact,
        sumCard: cashCollection.sumCard,
        sumVirtual: cashCollection.virtualSum,
        profit: cashCollection.sumFact + cashCollection.virtualSum,
        status: cashCollection.status,
        shortage: cashCollection.shortage,
        createdAt: cashCollection.createdAt,
        updatedAt: cashCollection.updatedAt,
        createdById: cashCollection.createdById,
        updatedById: cashCollection.updatedById,
        cashCollectionDeviceType: typeResponse,
      });
    }

    return {
      cashCollectionsData: response,
      totalCount: count,
    };
  }
}
