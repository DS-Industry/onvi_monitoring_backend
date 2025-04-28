import { Injectable } from '@nestjs/common';
import { IEquipmentKnotRepository } from '@equipment/equipmentKnot/interface/equipmentKnot';
import { EquipmentKnot } from '@equipment/equipmentKnot/domain/equipmentKnot';

@Injectable()
export class FindMethodsEquipmentKnotUseCase {
  constructor(
    private readonly equipmentKnotRepository: IEquipmentKnotRepository,
  ) {}

  async getById(input: number): Promise<EquipmentKnot> {
    return await this.equipmentKnotRepository.findOneById(input);
  }

  async getAllByPosId(input: number): Promise<EquipmentKnot[]> {
    return await this.equipmentKnotRepository.findAllByPosId(input);
  }
}
