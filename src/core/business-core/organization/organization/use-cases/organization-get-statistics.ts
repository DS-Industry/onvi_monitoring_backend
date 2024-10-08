import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';
import { OrganizationStatisticsResponseDto } from '@platform-user/core-controller/dto/response/organization-statistics-response.dto';
import { CheckCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-check-car';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';

@Injectable()
export class GetStatisticsOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly checkCarDeviceProgramUseCase: CheckCarDeviceProgramUseCase,
  ) {}

  async execute(
    input: OrganizationGetRatingDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    let countAuto = 0;
    const deviceOperations =
      await this.findMethodsDeviceOperationUseCase.getAllByOrgIdAndDateUseCase(
        input.organizationId,
        input.dateStart,
        input.dateEnd,
      );
    const totalSum = deviceOperations.reduce(
      (sum, operation) => sum + operation.operSum,
      0,
    );
    const deviceProgram =
      await this.findMethodsDeviceProgramUseCase.getAllByOrgIdAndDateProgram(
        input.organizationId,
        input.dateStart,
        input.dateEnd,
      );
    await Promise.all(
      deviceProgram.map(async (program) => {
        const isCarCheck = await this.checkCarDeviceProgramUseCase.execute(
          program.beginDate,
          program.carWashDeviceId,
          program.carWashDeviceProgramsTypeId,
        );
        if (isCarCheck) {
          countAuto++;
        }
      }),
    );
    return { sum: totalSum, cars: countAuto };
  }
}
