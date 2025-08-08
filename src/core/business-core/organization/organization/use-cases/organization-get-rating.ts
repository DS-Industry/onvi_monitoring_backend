import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingResponseDto } from '@organization/organization/use-cases/dto/organization-get-rating-response.dto';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';

@Injectable()
export class GetRatingOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
  ): Promise<OrganizationGetRatingResponseDto[]> {
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

    return await this.findMethodsDeviceOperationUseCase.getAllSumByPos(
      posIds,
      dateStart,
      dateEnd,
    );
  }
}
