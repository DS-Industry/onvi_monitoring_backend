import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingResponseDto } from '@organization/organization/use-cases/dto/organization-get-rating-response.dto';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';

@Injectable()
export class GetRatingOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
  ): Promise<OrganizationGetRatingResponseDto[]> {
    const response: OrganizationGetRatingResponseDto[] = [];
    const poses = await this.findMethodsPosUseCase.getAllByAbilityPos(ability);
    await Promise.all(
      poses.map(async (pos) => {
        const operations =
          await this.findMethodsDeviceOperationUseCase.getAllByPosIdAndDateUseCase(
            pos.id,
            dateStart,
            dateEnd,
          );
        const totalSum = operations.reduce(
          (sum, operation) => sum + operation.operSum,
          0,
        );
        response.push({ posName: pos.name, sum: totalSum });
      }),
    );
    response.sort((a, b) => b.sum - a.sum);
    return response;
  }
}
