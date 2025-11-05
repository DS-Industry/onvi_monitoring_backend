import { Incident } from '@equipment/incident/incident/domain/incident';
import { IncidentWithInfoDataDto } from "@equipment/incident/incident/use-cases/dto/incident-with-info-data.dto";

export abstract class IIncidentRepository {
  abstract create(input: Incident): Promise<Incident>;
  abstract findOneById(id: number): Promise<Incident>;
  abstract findAllByFilter(
    userId: number,
    posId?: number,
    dateStart?: Date,
    dateEnd?: Date,
  ): Promise<IncidentWithInfoDataDto[]>;
  abstract update(input: Incident): Promise<Incident>;
}
