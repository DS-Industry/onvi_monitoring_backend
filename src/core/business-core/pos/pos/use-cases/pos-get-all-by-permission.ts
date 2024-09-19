import { Injectable } from '@nestjs/common';
import { IPosRepository } from '@pos/pos/interface/pos';
import { Pos } from '@pos/pos/domain/pos';

@Injectable()
export class GetAllByPermissionPosUseCase {
  constructor(private readonly posRepository: IPosRepository) {}

  async execute(ability: any): Promise<Pos[]> {
    return this.posRepository.findAllByPermission(ability);
  }
}
