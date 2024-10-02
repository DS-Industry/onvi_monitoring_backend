import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { User } from '@platform-user/user/domain/user';
import { Pos } from '@pos/pos/domain/pos';
import slugify from 'slugify';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';
import { Address } from '@address/domain/address';
import { IAddressRepository } from '@address/interfaces/address';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';
import { PosCreateDto } from '@pos/pos/use-cases/dto/pos-create.dto';

@Injectable()
export class CreatePosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly addressRepository: IAddressRepository,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
    private readonly carWashPosRepository: ICarWashPosRepository,
  ) {}

  async execute(input: PosCreateDto, owner: User): Promise<PosResponseDto> {
    const addressData = new Address({
      city: input.address.city,
      location: input.address.location,
      lat: input?.address.lat,
      lon: input?.address.lon,
    });
    const address = await this.addressRepository.create(addressData);
    const posData = new Pos({
      name: input.name,
      slug: slugify(input.name, '_'),
      monthlyPlan: input?.monthlyPlan,
      addressId: address.id,
      organizationId: input.organizationId,
      posMetaData: input?.posMetaData,
      timezone: input.timezone,
      image: input?.image,
      status: input.status,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: owner.id,
      updatedById: owner.id,
    });

    const pos = await this.posRepository.create(posData);

    const nameCarWashPos = pos.name + ' Car Wash';
    const carWashPosData = new CarWashPos({
      name: nameCarWashPos,
      slug: slugify(nameCarWashPos, '_'),
      posId: pos.id,
    });
    await this.carWashPosRepository.create(carWashPosData);
    return this.posCreateFullDataUseCase.execute(pos);
  }
}
