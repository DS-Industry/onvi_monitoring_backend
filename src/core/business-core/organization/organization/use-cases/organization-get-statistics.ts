import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingDto } from '@organization/organization/use-cases/dto/organization-get-rating.dto';
import { OrganizationStatisticsResponseDto } from '@platform-user/organization/controller/dto/organization-statistics-response.dto';
import { DeviceOperationGetAllByOrgIdAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-all-by-org-id-and-date';
import { GetAllByOrgIdAndDateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-get-all-by-org-id-and-date';
import { CheckCarDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-check-car';

@Injectable()
export class GetStatisticsOrganizationUseCase {
  constructor(
    private readonly deviceOperationGetAllByOrgIdAndDateUseCase: DeviceOperationGetAllByOrgIdAndDateUseCase,
    private readonly getAllByOrgIdAndDateDeviceProgramUseCase: GetAllByOrgIdAndDateDeviceProgramUseCase,
    private readonly checkCarDeviceProgramUseCase: CheckCarDeviceProgramUseCase,
  ) {}

  async execute(
    input: OrganizationGetRatingDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    let countAuto = 0;
    const deviceOperations =
      await this.deviceOperationGetAllByOrgIdAndDateUseCase.execute(input);
    const totalSum = deviceOperations.reduce(
      (sum, operation) => sum + operation.operSum,
      0,
    );
    const deviceProgram =
      await this.getAllByOrgIdAndDateDeviceProgramUseCase.execute(input);
    await Promise.all(
      deviceProgram.map(async (program) => {
        const isCarCheck = await this.checkCarDeviceProgramUseCase.execute({
          deviceId: program.carWashDeviceId,
          dateProgram: program.beginDate,
          programTypeId: program.carWashDeviceProgramsTypeId,
        });
        if (isCarCheck) {
          countAuto++;
        }
      }),
    );
    return { sum: totalSum, cars: countAuto };
  }
}
