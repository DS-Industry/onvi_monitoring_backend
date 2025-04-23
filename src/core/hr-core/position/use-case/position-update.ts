import { Injectable } from '@nestjs/common';
import { IPositionRepository } from '@hr/position/interface/position';
import { Position } from '@hr/position/domain/position';

@Injectable()
export class UpdatePositionUseCase {
  constructor(private readonly positionRepository: IPositionRepository) {}

  async execute(
    oldPosition: Position,
    description?: string,
  ): Promise<Position> {
    oldPosition.description = description
      ? description
      : oldPosition.description;

    return await this.positionRepository.update(oldPosition);
  }
}
