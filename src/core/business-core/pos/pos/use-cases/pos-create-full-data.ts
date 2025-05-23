import { Injectable } from '@nestjs/common';
import { GetByIdAddressUseCase } from '@address/use-case/address-get-by-id';
import { Pos } from '@pos/pos/domain/pos';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { CarWashPosType } from '@prisma/client';

@Injectable()
export class CreateFullDataPosUseCase {
  constructor(
    private readonly addressGetByIdUseCase: GetByIdAddressUseCase,
    private readonly carWashPosRepository: ICarWashPosRepository,
  ) {}

  async execute(pos: Pos): Promise<PosResponseDto> {
    const address = await this.addressGetByIdUseCase.execute(pos.addressId);
    const carWashPos = await this.carWashPosRepository.findOneByPosId(pos.id);
    return {
      id: pos.id,
      name: pos.name,
      slug: pos.slug,
      timeWork: pos.timeWork,
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
        carWashPosType: carWashPos.carWashPosType,
        minSumOrder: carWashPos.minSumOrder,
        maxSumOrder: carWashPos.maxSumOrder,
        stepSumOrder: carWashPos.stepSumOrder,
      },
    };
  }
}
