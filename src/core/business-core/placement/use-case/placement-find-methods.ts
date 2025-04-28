import { Injectable } from '@nestjs/common';
import { IPlacementRepository } from '@business-core/placement/interface/placement';
import { Placement } from '@business-core/placement/domain/placement';

@Injectable()
export class FindMethodsPlacementUseCase {
  constructor(private readonly placementRepository: IPlacementRepository) {}

  async getOneById(id: number): Promise<Placement> {
    return await this.placementRepository.findOneById(id);
  }

  async getAll(): Promise<Placement[]> {
    return await this.placementRepository.findAll();
  }
}
