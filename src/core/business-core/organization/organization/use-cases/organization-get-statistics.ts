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
    const posIds = input.ability.rules
      .filter(
        (rule: {
          subject: string;
          action: string;
          conditions: { id: { in: any } };
        }) =>
          rule.action === 'read' &&
          rule.subject === 'Pos' &&
          rule.conditions?.id?.in,
      )
      .flatMap(
        (rule: { conditions: { id: { in: any } } }) => rule.conditions.id.in,
      );
    if (!posIds.length) {
      return { sum: 0, cars: 0 };
    }
    const [deviceOperations, devicePrograms] = await Promise.all([
      this.findMethodsDeviceOperationUseCase.getAllSumByPos(
        posIds,
        input.dateStart,
        input.dateEnd,
      ),
      this.findMethodsDeviceProgramUseCase.getAllByFilter({
        posIds: posIds,
        dateStart: input.dateStart,
        dateEnd: input.dateEnd,
      }),
    ]);
    const totalSum = deviceOperations.reduce((sum, item) => sum + item.sum, 0);

    const countAuto =
      await this.countCarDeviceProgramUseCase.executeByDeviceProgram(
        devicePrograms,
      );
    return { sum: totalSum, cars: countAuto };
  }
}
