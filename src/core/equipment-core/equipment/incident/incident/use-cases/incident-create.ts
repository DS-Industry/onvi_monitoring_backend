import { Injectable } from '@nestjs/common';
import { IIncidentRepository } from '@equipment/incident/incident/interface/incident';
import { IncidentCreateDto } from '@equipment/incident/incident/use-cases/dto/incident-create.dto';
import { User } from '@platform-user/user/domain/user';
import { Incident } from '@equipment/incident/incident/domain/incident';

@Injectable()
export class CreateIncidentUseCase {
  constructor(private readonly incidentRepository: IIncidentRepository) {}

  async execute(input: IncidentCreateDto, user: User): Promise<Incident> {
    const incidentData = new Incident({
      posId: input.posId,
      workerId: input.workerId,
      appearanceDate: input.appearanceDate,
      startDate: input.startDate,
      finishDate: input.finishDate,
      objectName: input.objectName,
      equipmentKnotId: input?.equipmentKnotId,
      incidentNameId: input?.incidentNameId,
      incidentReasonId: input?.incidentReasonId,
      incidentSolutionId: input?.incidentSolutionId,
      downtime: input.downtime,
      comment: input.comment,
      carWashDeviceProgramsTypeId: input?.carWashDeviceProgramsTypeId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      createdById: user.id,
      updatedById: user.id,
    });

    return await this.incidentRepository.create(incidentData);
  }
}
