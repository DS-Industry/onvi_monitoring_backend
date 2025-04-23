import { Injectable } from '@nestjs/common';
import { PosFilterResponseDto } from '@platform-user/core-controller/dto/response/pos-filter-by-response.dto';
import { IPosRepository } from '@pos/pos/interface/pos';
import { GetByIdAddressUseCase } from '@address/use-case/address-get-by-id';

@Injectable()
export class FilterByUserPosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly getByIdAddressUseCase: GetByIdAddressUseCase,
  ) {}

  async execute(
    ability: any,
    placementId: number | '*',
  ): Promise<PosFilterResponseDto[]> {
    const poses: PosFilterResponseDto[] = [];

    const accessPoses = await this.posRepository.findAllByPermission(
      ability,
      placementId,
    );
    await Promise.all(
      accessPoses.map(async (pos) => {
        const address = await this.getByIdAddressUseCase.execute(pos.addressId);
        poses.push({
          id: pos.id,
          name: pos.name,
          slug: pos.slug,
          address: address.location,
          organizationId: pos.organizationId,
          placementId: pos.placementId,
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
