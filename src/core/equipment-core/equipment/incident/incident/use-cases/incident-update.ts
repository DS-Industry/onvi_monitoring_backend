import { Injectable } from '@nestjs/common';
import { IIncidentRepository } from '@equipment/incident/incident/interface/incident';
import { User } from '@platform-user/user/domain/user';
import { Incident } from '@equipment/incident/incident/domain/incident';
import { IncidentUpdateDto } from '@equipment/incident/incident/use-cases/dto/incident-update.dto';

@Injectable()
export class UpdateIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(
    input: IncidentUpdateDto,
    oldIncident: Incident,
    user: User,
  ): Promise<Incident> {
    const {
      workerId,
      appearanceDate,
      startDate,
      finishDate,
      objectName,
      equipmentKnotId,
      incidentNameId,
      incidentReasonId,
      incidentSolutionId,
      downtime,
      comment,
      carWashDeviceProgramsTypeId,
    } = input;

    oldIncident.workerId = workerId ? workerId : oldIncident.workerId;
    oldIncident.appearanceDate = appearanceDate
      ? appearanceDate
      : oldIncident.appearanceDate;
    oldIncident.startDate = startDate ? startDate : oldIncident.startDate;
    oldIncident.finishDate = finishDate ? finishDate : oldIncident.finishDate;
    oldIncident.objectName = objectName ? objectName : oldIncident.objectName;
    oldIncident.equipmentKnotId = equipmentKnotId
      ? equipmentKnotId
      : oldIncident.equipmentKnotId;
    oldIncident.incidentNameId = incidentNameId
      ? incidentNameId
      : oldIncident.incidentNameId;
    oldIncident.incidentReasonId = incidentReasonId
      ? incidentReasonId
      : oldIncident.incidentReasonId;
    oldIncident.incidentSolutionId = incidentSolutionId
      ? incidentSolutionId
      : oldIncident.incidentSolutionId;
    oldIncident.downtime = downtime ? downtime : oldIncident.downtime;
    oldIncident.comment = comment ? comment : oldIncident.comment;
    oldIncident.carWashDeviceProgramsTypeId = carWashDeviceProgramsTypeId
      ? carWashDeviceProgramsTypeId
      : oldIncident.carWashDeviceProgramsTypeId;

    oldIncident.updatedAt = new Date(Date.now());
    oldIncident.updatedById = user.id;
    return await this.incidentRepository.update(oldIncident);
  }
}
