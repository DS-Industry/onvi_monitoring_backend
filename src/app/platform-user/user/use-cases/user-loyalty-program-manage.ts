import { Injectable } from '@nestjs/common';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { LoyaltyProgramPermissionsResponseDto } from '@platform-user/core-controller/dto/response/loyalty-program-permissions-response.dto';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';

@Injectable()
export class LoyaltyProgramManageUserUseCase {
  constructor(
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
  ) {}

  async execute(ability: any): Promise<LoyaltyProgramPermissionsResponseDto[]> {
    const response: LoyaltyProgramPermissionsResponseDto[] = [];
    const organizations =
      await this.findMethodsOrganizationUseCase.getAllByAbility(ability);
    await Promise.all(
      organizations.map(async () => {
        const loyaltyPrograms =
          await this.findMethodsLoyaltyProgramUseCase.getAll();

        loyaltyPrograms.forEach((loyaltyProgram) => {
          response.push({
            id: loyaltyProgram.id,
            name: loyaltyProgram.name,
          });
        });
      }),
    );

    return response;
  }
}
