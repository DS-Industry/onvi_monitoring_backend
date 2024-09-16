import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';
import { OrganizationGetRatingResponseDto } from '@organization/organization/use-cases/dto/organization-get-rating-response.dto';
import { GetAllPosOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-pos';
import { DeviceOperationGetAllByPosIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-pos-id-and-date';

@Injectable()
export class GetRatingOrganizationUseCase {
  constructor(
    private readonly getAllPosOrganizationUseCase: GetAllPosOrganizationUseCase,
    private readonly deviceOperationGetAllByPosIdAndDateUseCase: DeviceOperationGetAllByPosIdAndDateUseCase,
  ) {}

  async execute(
    input: OrganizationGetRatingDto,
  ): Promise<OrganizationGetRatingResponseDto[]> {
    const response: OrganizationGetRatingResponseDto[] = [];
    const poses = await this.getAllPosOrganizationUseCase.execute(
      input.organizationId,
    );
    await Promise.all(
      poses.map(async (pos) => {
        const operations =
          await this.deviceOperationGetAllByPosIdAndDateUseCase.execute({
            carWashPosId: pos.id,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
          });
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
