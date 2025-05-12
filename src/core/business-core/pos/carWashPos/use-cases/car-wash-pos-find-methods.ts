import { Injectable } from '@nestjs/common';
import { ICarWashPosRepository } from '@pos/carWashPos/interface/carWashPos';
import { CarWashPos } from '@pos/carWashPos/domain/carWashPos';

@Injectable()
export class FindMethodsCarWashPosUseCase {
  constructor(private readonly carWashPosRepository: ICarWashPosRepository) {}

  async getById(input: number): Promise<CarWashPos> {
    return await this.carWashPosRepository.findOneById(input);
  }
}
