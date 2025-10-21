import { Injectable } from '@nestjs/common';
import { OrganizationGetRatingResponseDto } from '@organization/organization/use-cases/dto/organization-get-rating-response.dto';
import { FindMethodsDeviceOperationUseCase } from '@pos/device/device-data/device-data/device-operation/use-cases/device-operation-find-methods';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';

@Injectable()
export class GetRatingOrganizationUseCase {
  constructor(
    private readonly findMethodsDeviceOperationUseCase: FindMethodsDeviceOperationUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    ability: any,
    ltyProgramId?: number,
  ): Promise<OrganizationGetRatingResponseDto[]> {
    let posIds: number[];

    if (ltyProgramId) {
      const organizations = await this.findMethodsOrganizationUseCase.getAllParticipantOrganizationsByLoyaltyProgramId(
        ltyProgramId,
      );

      if (organizations.length === 0) {
        return [];
      }

      const organizationIds = organizations.map(org => org.id);
      const poses = await this.findMethodsPosUseCase.getAllByOrganizationIds(organizationIds);
      posIds = poses.map(pos => pos.id);
    } else {
      posIds = ability.rules
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
    }

    if (!posIds.length) {
      return [];
    }

    return await this.findMethodsDeviceOperationUseCase.getAllSumByPos(
      posIds,
      dateStart,
      dateEnd,
    );
  }
}
