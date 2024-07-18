import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { PosCreateDto } from '@platform-user/pos/controller/dto/pos-create.dto';
import { User } from '@platform-user/user/domain/user';
import { Pos } from '@pos/pos/domain/pos';
import { CreateAddressUseCase } from '@address/use-case/address-create';
import slugify from 'slugify';
import { CreateCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-create';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';
import { CreateFullDataPosUseCase } from '@pos/pos/use-cases/pos-create-full-data';

@Injectable()
export class CreatePosUseCase {
  constructor(
    private readonly posRepository: IPosRepository,
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly createCarWashPosUseCase: CreateCarWashPosUseCase,
    private readonly posCreateFullDataUseCase: CreateFullDataPosUseCase,
  ) {}

  async execute(input: PosCreateDto, owner: User): Promise<PosResponseDto> {
    const checkPos = await this.posRepository.findOneByName(input.name);
    if (checkPos) {
      throw new Error('pos exists');
    }

    const address = await this.createAddressUseCase.execute(input.address);
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
    await this.createCarWashPosUseCase.execute(pos.name, pos.id);
    return this.posCreateFullDataUseCase.execute(pos);
  }
}
