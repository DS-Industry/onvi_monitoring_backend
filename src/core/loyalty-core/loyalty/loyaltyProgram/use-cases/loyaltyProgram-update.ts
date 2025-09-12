import { Injectable } from '@nestjs/common';
import { ILoyaltyProgramRepository } from '@loyalty/loyalty/loyaltyProgram/interface/loyaltyProgram';
import { UpdateDto } from '@loyalty/loyalty/loyaltyProgram/use-cases/dto/update.dto';
import { LTYProgram } from '@loyalty/loyalty/loyaltyProgram/domain/loyaltyProgram';
import { Organization } from '@organization/organization/domain/organization';

@Injectable()
export class UpdateLoyaltyProgramUseCase {
  constructor(
    private readonly loyaltyProgramRepository: ILoyaltyProgramRepository,
  ) {}

  async execute(
    input: UpdateDto,
    oldLoyaltyProgram: LTYProgram,
    organizations: Organization[],
  ): Promise<LTYProgram> {
    const { name, organizationIds } = input;

    oldLoyaltyProgram.name = name ? name : oldLoyaltyProgram.name;
    let deleteOrganizationIds = [];
    let addOrganizationIds = [];

    if (input.organizationIds) {
      const existingOrganizationIds = organizations.map(
        (organization) => organization.id,
      );

      deleteOrganizationIds = existingOrganizationIds.filter(
        (id) => !organizationIds.includes(id),
      );
      addOrganizationIds = organizationIds.filter(
        (id) => !existingOrganizationIds.includes(id),
      );
    }

    return await this.loyaltyProgramRepository.update(
      oldLoyaltyProgram,
      addOrganizationIds,
      deleteOrganizationIds,
    );
  }
}
