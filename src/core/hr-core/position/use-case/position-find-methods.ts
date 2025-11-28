import { Injectable } from '@nestjs/common';
import { IPositionRepository } from '@hr/position/interface/position';
import { Position } from '@hr/position/domain/position';
import { User } from '@platform-user/user/domain/user';

@Injectable()
export class FindMethodsPositionUseCase {
  constructor(private readonly positionRepository: IPositionRepository) {}

  async getById(id: number): Promise<Position> {
    return await this.positionRepository.findOneById(id);
  }

  async getAll(): Promise<Position[]> {
    return await this.positionRepository.findAll();
  }

  async getAllByPermissionUser(user: User): Promise<Position[]> {
    return await this.positionRepository.findAllByUser(user);
  }

  async getAllByOrgId(orgId: number): Promise<Position[]> {
    return await this.positionRepository.findAllByOrgId(orgId);
  }
}
