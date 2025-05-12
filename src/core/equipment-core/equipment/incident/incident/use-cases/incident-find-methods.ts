import { Injectable } from '@nestjs/common';
import { IIncidentRepository } from '@equipment/incident/incident/interface/incident';
import { Incident } from '@equipment/incident/incident/domain/incident';

@Injectable()
export class FindMethodsIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async getById(input: number): Promise<Incident> {
    return await this.incidentRepository.findOneById(input);
  }

  async getAllByPosId(id: number): Promise<Incident[]> {
    return await this.incidentRepository.findAllByPosId(id);
  }

  async getAllByPosIdAndDate(
    id: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<Incident[]> {
    return await this.incidentRepository.findAllByPosIdAndDate(
      id,
      dateStart,
      dateEnd,
    );
  }
}
