import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';
import { OrganizationStatisticsResponseDto } from '@platform-user/core-controller/dto/response/organization-statistics-response.dto';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import {
  PORTAL_PROGRAM_TYPES,
  PROGRAM_TIME_CHECK_AUTO,
  PROGRAM_TYPE_ID_CHECK_AUTO,
} from '@constant/constants';

@Injectable()
export class GetStatisticsOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(
    input: OrganizationGetRatingDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    const [deviceOperations, devicePrograms] = await Promise.all([
      this.findMethodsDeviceOperationUseCase.getAllByOrgIdAndDateUseCase(
        input.organizationId,
        input.dateStart,
        input.dateEnd,
      ),
      this.findMethodsDeviceProgramUseCase.getAllByOrgIdAndDateProgram(
        input.organizationId,
        input.dateStart,
        input.dateEnd,
      ),
    ]);
    const totalSum = deviceOperations.reduce(
      (sum, operation) => sum + operation.operSum,
      0,
    );

    const countAuto = this.countCarsInPrograms(devicePrograms);
    return { sum: totalSum, cars: countAuto };
  }

  private countCarsInPrograms(devicePrograms: DeviceProgram[]): number {
    const lastCheckAutoTimeMap = new Map<number, Date>();
    let totalCars = 0;

    for (const program of devicePrograms) {
      if (PORTAL_PROGRAM_TYPES.includes(program.carWashDeviceProgramsTypeId)) {
        totalCars++;
      } else if (
        program.carWashDeviceProgramsTypeId === PROGRAM_TYPE_ID_CHECK_AUTO
      ) {
        const deviceId = program.carWashDeviceId;
        const lastCheckAutoTime = lastCheckAutoTimeMap.get(deviceId);

        if (
          lastCheckAutoTime === undefined ||
          (program.beginDate.getTime() - lastCheckAutoTime.getTime()) /
            (1000 * 60) >
            PROGRAM_TIME_CHECK_AUTO
        ) {
          totalCars++;
        }

        lastCheckAutoTimeMap.set(deviceId, program.beginDate);
      }
    }

    return totalCars;
  }
}
