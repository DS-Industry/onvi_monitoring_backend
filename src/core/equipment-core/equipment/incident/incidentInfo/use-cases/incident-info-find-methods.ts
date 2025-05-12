import { Injectable } from '@nestjs/common';
import { IIncidentInfoRepository } from '@equipment/incident/incidentInfo/interface/incidentInfo';
import { IncidentInfo } from '@equipment/incident/incidentInfo/domain/incidentInfo';

@Injectable()
export class FindMethodsIncidentInfoUseCase {
  constructor(
    private readonly incidentInfoRepository: IIncidentInfoRepository,
  ) {}

  async getById(input: number): Promise<IncidentInfo> {
    return await this.incidentInfoRepository.findOneById(input);
  }

  async getAllByIncidentNameId(input: number): Promise<IncidentInfo[]> {
    return await this.incidentInfoRepository.findAllByIncidentNameId(input);
  }
}
