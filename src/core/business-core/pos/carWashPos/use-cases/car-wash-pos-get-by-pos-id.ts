import { Injectable } from '@nestjs/common';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';

@Injectable()
export class GetByPosIdCarWashPosUseCase {
  constructor(private readonly carWashPosRepository: ICarWashPosRepository) {}

  async execute(posId: number): Promise<CarWashPos> {
    const carWashPos = await this.carWashPosRepository.findOneByPosId(posId);
    if (!carWashPos) {
      throw new Error('carWashPos not exists');
    }
    return carWashPos;
  }
}
