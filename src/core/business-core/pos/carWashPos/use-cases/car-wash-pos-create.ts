import { Injectable } from '@nestjs/common';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';
import slugify from 'slugify';

@Injectable()
export class CreateCarWashPosUseCase {
  constructor(private readonly carWashPosRepository: ICarWashPosRepository) {}

  async execute(name: string, posId: number): Promise<CarWashPos> {
    const nameCarWashPos = name + ' Car Wash';
    const carWashPosData = new CarWashPos({
      name: nameCarWashPos,
      slug: slugify(nameCarWashPos, '_'),
      posId: posId,
    });
    return await this.carWashPosRepository.create(carWashPosData);
  }
}
