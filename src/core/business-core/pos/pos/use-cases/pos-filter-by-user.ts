import { Injectable } from '@nestjs/common';
import { PosFilterResponseDto } from '@platform-user/core-controller/dto/response/pos-filter-by-response.dto';
import { IPosRepository } from '@pos/pos/interface/pos';

@Injectable()
export class FilterByUserPosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
  ) {}

  async execute(ability: any): Promise<PosFilterResponseDto[]> {
    const poses: PosFilterResponseDto[] = [];

    const accessPoses = await this.posRepository.findAllByPermission(ability);
    await Promise.all(
      accessPoses.map(async (pos) => {
        poses.push({
          id: pos.id,
          name: pos.name,
          slug: pos.slug,
          address: pos.address.location,
          monthlyPlan: pos.monthlyPlan,
          organizationId: pos.organizationId,
          timeZone: pos.timezone,
          posStatus: pos.status,
          createdAt: pos.createdAt,
          updatedAt: pos.updatedAt,
          createdById: pos.createdById,
          updatedById: pos.updatedById,
        });
      }),
    );

    return poses;
  }
}
