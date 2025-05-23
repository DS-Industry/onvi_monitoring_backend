import { Injectable } from '@nestjs/common';
import {
  CashCollectionDeviceTypeResponseDto,
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
    const response: CashCollectionsDataResponseDto[] = [];
    const count =
      await this.findMethodsCashCollectionUseCase.getCountAllByPosIdsAndDate(
        posIds,
        dateStart,
        dateEnd,
      );
    const cashCollections =
      await this.findMethodsCashCollectionUseCase.getAllByPosIdsAndDate(
        posIds,
        dateStart,
        dateEnd,
        skip,
        take,
      );
    await Promise.all(
      cashCollections.map(async (cashCollection) => {
        const typeResponse: CashCollectionDeviceTypeResponseDto[] = [];
        const cashCollectionDeviceType =
          await this.findMethodsCashCollectionTypeUseCase.getAllByCashCollectionId(
            cashCollection.id,
          );
        cashCollectionDeviceType.map((cashCollectionType) =>
          typeResponse.push({
            typeName: cashCollectionType.carWashDeviceTypeName,
            typeShortage: cashCollectionType.shortage,
          }),
        );

        response.push({
          id: cashCollection.id,
          posId: cashCollection.posId,
          period:
            cashCollection.oldCashCollectionDate.toString() +
            '-' +
            cashCollection.cashCollectionDate.toString(),
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
      }),
    );
    return {
      cashCollectionsData: response,
      totalCount: count,
    };
  }
}
