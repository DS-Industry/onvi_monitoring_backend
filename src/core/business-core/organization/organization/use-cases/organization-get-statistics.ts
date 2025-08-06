import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';
import { OrganizationStatisticsResponseDto } from '@platform-user/core-controller/dto/response/organization-statistics-response.dto';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { CountCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-count-car';

@Injectable()
export class GetStatisticsOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly countCarDeviceProgramUseCase: CountCarDeviceProgramUseCase,
  ) {}

  async execute(
    input: OrganizationGetRatingDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    const [deviceOperations, devicePrograms] = await Promise.all([
      this.findMethodsDeviceOperationUseCase.getAllByFilter({
        organizationId: input.organizationId,
        dateStart: input.dateStart,
        dateEnd: input.dateEnd,
      }),
      this.findMethodsDeviceProgramUseCase.getAllByFilter({
        organizationId: input.organizationId,
        dateStart: input.dateStart,
        dateEnd: input.dateEnd,
      }),
    ]);
    const totalSum = deviceOperations.reduce(
      (sum, operation) => sum + operation.operSum,
      0,
    );

    const countAuto =
      await this.countCarDeviceProgramUseCase.executeByDeviceProgram(
        devicePrograms,
      );
    return { sum: totalSum, cars: countAuto };
  }
}
