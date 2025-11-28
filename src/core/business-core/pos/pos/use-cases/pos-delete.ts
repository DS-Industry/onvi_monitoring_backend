import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { Pos } from '@pos/pos/domain/pos';

@Injectable()
export class DeletePosUseCase {
  constructor(private readonly posRepository: IPosRepository) {}

  async execute(id: number): Promise<Pos> {
    return await this.posRepository.softDelete(id);
  }
}
