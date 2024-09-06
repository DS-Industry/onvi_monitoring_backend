import { Injectable } from '@nestjs/common';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';

@Injectable()
export class GetByIdCarWashPosUseCase {
  constructor(private readonly carWashPosRepository: ICarWashPosRepository) {}

  async execute(id: number): Promise<CarWashPos> {
    const carWashPos = await this.carWashPosRepository.findOneById(id);
    if (!carWashPos) {
      throw new Error('carWashPos not exists');
    }
    return carWashPos;
  }
}
