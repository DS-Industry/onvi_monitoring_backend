import { Injectable } from '@nestjs/common';
import { IPositionRepository } from '@hr/position/interface/position';
import { Position } from '@hr/position/domain/position';

@Injectable()
export class FindMethodsPositionUseCase {
  constructor(private readonly positionRepository: IPositionRepository) {}

  async getById(id: number): Promise<Position> {
    return await this.positionRepository.findOneById(id);
  }

  async getAll(): Promise<Position[]> {
    return await this.positionRepository.findAll();
  }

  async getAllByAbility(ability: any): Promise<Position[]> {
    return await this.positionRepository.findAllByAbility(ability);
  }

  async getAllByOrgId(orgId: number): Promise<Position[]> {
    return await this.positionRepository.findAllByOrgId(orgId);
  }
}
