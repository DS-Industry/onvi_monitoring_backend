import { Injectable } from '@nestjs/common';
import { PosFilterResponseDto } from '@platform-user/pos/controller/dto/pos-filter-by-response.dto';
import { GetByIdUserUseCase } from '@platform-user/user/use-cases/user-get-by-id';
import { IPosRepository } from '@pos/pos/interface/pos';
import { IOrganizationRepository } from '@organization/organization/interfaces/organization';

@Injectable()
export class FilterByUserPosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly getByIdUserUseCase: GetByIdUserUseCase,
    //private readonly organizationRepository: IOrganizationRepository,
  ) {}

  async execute(ability: any): Promise<PosFilterResponseDto[]> {
    const poses: PosFilterResponseDto[] = [];

    const accessPoses = await this.posRepository.findAllByPermission(ability);
    await Promise.all(
      accessPoses.map(async (pos) => {
        /*const organization = await this.organizationRepository.findOneById(
          pos.organizationId,
        );*/
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
          organizationName: 'organization.name',
          timeZone: pos.timezone,
          posStatus: pos.status,
          createdAt: pos.createdAt,
          updatedAt: pos.updatedAt,
          createdBy: createdBy.surname,
          updatedBy: updatedBy.surname,
        });
      }),
    );

    return poses;
  }
}
