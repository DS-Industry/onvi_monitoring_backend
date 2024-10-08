import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';
import { OrganizationGetRatingResponseDto } from '@organization/organization/use-cases/dto/organization-get-rating-response.dto';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';

@Injectable()
export class GetRatingOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
  ) {}

  async execute(
    input: OrganizationGetRatingDto,
  ): Promise<OrganizationGetRatingResponseDto[]> {
    const response: OrganizationGetRatingResponseDto[] = [];
    const poses = await this.findMethodsOrganizationUseCase.getAllPos(
      input.organizationId,
    );
    await Promise.all(
      poses.map(async (pos) => {
        const operations =
          await this.findMethodsDeviceOperationUseCase.getAllByPosIdAndDateUseCase(
            pos.id,
            input.dateStart,
            input.dateEnd,
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
