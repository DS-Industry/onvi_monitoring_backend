import { Incident } from '@equipment/incident/incident/domain/incident';

export abstract class IIncidentRepository {
  abstract create(input: Incident): Promise<Incident>;
  abstract findOneById(id: number): Promise<Incident>;
  abstract findAllByPosId(id: number): Promise<Incident[]>;
  abstract findAllByPosIdAndDate(
    id: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<Incident[]>;
  abstract findAllByDate(dateStart: Date, dateEnd: Date): Promise<Incident[]>;
  abstract update(input: Incident): Promise<Incident>;
}
