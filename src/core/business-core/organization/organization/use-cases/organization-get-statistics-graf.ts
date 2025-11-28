import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { OrganizationStatisticGrafResponseDto } from '@platform-user/core-controller/dto/response/organization-statistic-graf-response.dto';

@Injectable()
export class GetStatisticsGrafOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
  ): Promise<OrganizationStatisticGrafResponseDto[]> {
    const posIds = ability.rules
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
      return [];
    }

    return await this.findMethodsDeviceOperationUseCase.getDailyStatistics(
      posIds,
      dateStart,
      dateEnd,
    );
  }
}
