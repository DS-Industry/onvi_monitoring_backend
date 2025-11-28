import { Injectable } from '@nestjs/common';
import { IIncidentRepository } from '@equipment/incident/incident/interface/incident';
import { Incident } from '@equipment/incident/incident/domain/incident';
import { IncidentWithInfoDataDto } from '@equipment/incident/incident/use-cases/dto/incident-with-info-data.dto';

@Injectable()
export class FindMethodsIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async getById(input: number): Promise<Incident> {
    return await this.incidentRepository.findOneById(input);
  }
  async getAllByFilter(date: {
    userId: number;
    posId?: number;
    dateStart?: Date;
    dateEnd?: Date;
  }): Promise<IncidentWithInfoDataDto[]> {
    return await this.incidentRepository.findAllByFilter(
      date.userId,
      date.posId,
      date.dateStart,
      date.dateEnd,
    );
  }
}
