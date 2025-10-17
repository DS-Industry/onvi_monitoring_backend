import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { Pos } from '@pos/pos/domain/pos';

@Injectable()
export class FindMethodsPosUseCase {
  constructor(private readonly posRepository: IPosRepository) {}

  async getById(input: number): Promise<Pos> {
    return await this.posRepository.findOneById(input);
  }

  async getByName(input: string): Promise<Pos> {
    return await this.posRepository.findOneByName(input);
  }

  async getAllByFilter(data: {
    ability?: any;
    placementId?: number;
    organizationId?: number;
    userId?: number;
    skip?: number;
    take?: number;
  }): Promise<PosResponseDto[]> {
    return await this.posRepository.findAllByFilter(
      data.ability,
      data.placementId,
      data.organizationId,
      data.userId,
      data.skip,
      data.take,
    );
  }

  async countAllByAbilityAndPlacement(data: {
    ability?: any;
    placementId?: number;
    organizationId?: number;
    userId?: number;
  }): Promise<number> {
    return await this.posRepository.countAllByAbilityAndPlacement(
      data.ability,
      data.placementId,
      data.organizationId,
      data.userId,
    );
  }

  async getAllByOrganizationIds(organizationIds: number[]): Promise<PosResponseDto[]> {
    return await this.posRepository.findAllByOrganizationIds(organizationIds);
  }
}
