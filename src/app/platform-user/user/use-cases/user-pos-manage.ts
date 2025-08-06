import { Injectable } from '@nestjs/common';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { PosPermissionsResponseDto } from '@platform-user/core-controller/dto/response/pos-permissions-response.dto';
import { FindMethodsPosUseCase } from '@pos/pos/use-cases/pos-find-methods';

@Injectable()
export class PosManageUserUseCase {
  constructor(
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
  ) {}

  async execute(ability: any): Promise<PosPermissionsResponseDto[]> {
    const response: PosPermissionsResponseDto[] = [];
    const organizations =
      await this.findMethodsOrganizationUseCase.getAllByAbility(ability);
    await Promise.all(
      organizations.map(async (org) => {
        const poses = await this.findMethodsPosUseCase.getAllByFilter({
          organizationId: org.id,
        });

        poses.forEach((pos) => {
          response.push({
            id: pos.id,
            name: pos.name,
          });
        });
      }),
    );

    return response;
  }
}
