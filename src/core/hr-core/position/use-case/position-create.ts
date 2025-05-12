import { Injectable } from '@nestjs/common';
import { IPositionRepository } from '@hr/position/interface/position';
import { Position } from '@hr/position/domain/position';

@Injectable()
export class CreatePositionUseCase {
  constructor(private readonly positionRepository: IPositionRepository) {}

  async execute(
    name: string,
    organizationId: number,
    description?: string,
  ): Promise<Position> {
    const position = new Position({
      name: name,
      organizationId: organizationId,
      description: description,
    });

    return await this.positionRepository.create(position);
  }
}
