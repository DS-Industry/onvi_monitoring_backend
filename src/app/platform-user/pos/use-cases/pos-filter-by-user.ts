import { Injectable } from '@nestjs/common';
import { GetAllByUserOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-by-user';
import { PosFilterResponseDto } from '@platform-user/pos/controller/dto/pos-filter-by-response.dto';
import { GetAllPosOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-pos';
import { GetByIdUserUseCase } from '@platform-user/user/use-cases/user-get-by-id';

@Injectable()
export class FilterByUserPosUseCase {
  constructor(
    private readonly getAllByUserOrganization: GetAllByUserOrganizationUseCase,
    private readonly getAllByOrganizationPos: GetAllPosOrganizationUseCase,
    private readonly getByIdUserUseCase: GetByIdUserUseCase,
  ) {}

  async execute(userId: number): Promise<PosFilterResponseDto[]> {
    const organizations = await this.getAllByUserOrganization.execute(userId);

    const poses: PosFilterResponseDto[] = [];
    await Promise.all(
      organizations.map(async (organization) => {
        const organizationPos = await this.getAllByOrganizationPos.execute(
          organization.id,
        );
        await Promise.all(
          organizationPos.map(async (pos) => {
            const createdBy = await this.getByIdUserUseCase.execute(
              pos.createdById,
            );
            const updatedBy = await this.getByIdUserUseCase.execute(
              pos.updatedById,
            );
            poses.push({
              id: pos.id,
              name: pos.name,
              slug: pos.slug,
              address: pos.address.location,
              monthlyPlan: pos.monthlyPlan,
              organizationName: organization.name,
              timeZone: pos.timezone,
              posStatus: pos.status,
              createdAt: pos.createdAt,
              updatedAt: pos.updatedAt,
              createdBy: createdBy.surname,
              updatedBy: updatedBy.surname,
            });
          }),
        );
      }),
    );
    return poses;
  }
}
