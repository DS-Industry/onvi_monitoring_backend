import { Injectable } from '@nestjs/common';
import { IIncidentNameRepository } from '@equipment/incident/incidentName/interface/incidentName';
import { IncidentName } from '@equipment/incident/incidentName/domain/incidentName';

@Injectable()
export class FindMethodsIncidentNameUseCase {
  constructor(
    private readonly incidentNameRepository: IIncidentNameRepository,
  ) {}

  async getById(input: number): Promise<IncidentName> {
    return await this.incidentNameRepository.findOneById(input);
  }

  async getAllByEquipmentKnotId(input: number): Promise<IncidentName[]> {
    return await this.incidentNameRepository.findAllByEquipmentKnotId(input);
  }
}
