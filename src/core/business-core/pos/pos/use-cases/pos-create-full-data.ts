import { Injectable } from '@nestjs/common';
import { GetByIdAddressUseCase } from '@address/use-case/address-get-by-id';
import { GetByPosIdCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-get-by-pos-id';
import { Pos } from '@pos/pos/domain/pos';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';

@Injectable()
export class CreateFullDataPosUseCase {
  constructor(
    private readonly addressGetByIdUseCase: GetByIdAddressUseCase,
    private readonly carWashPosByPosIdUseCase: GetByPosIdCarWashPosUseCase,
  ) {}

  async execute(pos: Pos): Promise<PosResponseDto> {
    const address = await this.addressGetByIdUseCase.execute(pos.addressId);
    const carWashPos = await this.carWashPosByPosIdUseCase.execute(pos.id);
    return {
      id: pos.id,
      name: pos.name,
      slug: pos.slug,
      monthlyPlan: pos.monthlyPlan,
      organizationId: pos.organizationId,
      posMetaData: pos.posMetaData,
      timezone: pos.timezone,
      image: pos.image,
      rating: pos.rating,
      status: pos.status,
      createdAt: pos.createdAt,
      updatedAt: pos.updatedAt,
      createdById: pos.createdById,
      updatedById: pos.updatedById,
      address: {
        id: address.id,
        city: address.city,
        location: address.location,
        lat: address.lat,
        lon: address.lon,
      },
      posType: {
        id: carWashPos.id,
        name: carWashPos.name,
        slug: carWashPos.slug,
      },
    };
  }
}
