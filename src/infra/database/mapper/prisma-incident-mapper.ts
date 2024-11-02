import { Incident as PrismaIncident, Prisma } from '@prisma/client';
import { Incident } from '@equipment/incident/incident/domain/incident';

export class PrismaIncidentMapper {
  static toDomain(entity: PrismaIncident): Incident {
    if (!entity) {
      return null;
    }
    return new Incident({
      id: entity.id,
      posId: entity.posId,
      workerId: entity.workerId,
      appearanceDate: entity.appearanceDate,
      startDate: entity.startDate,
      finishDate: entity.finishDate,
      objectName: entity.objectName,
      equipmentKnotId: entity?.equipmentKnotId,
      incidentNameId: entity?.incidentNameId,
      incidentReasonId: entity?.incidentReasonId,
      incidentSolutionId: entity?.incidentSolutionId,
      downtime: entity.downtime,
      comment: entity.comment,
      carWashDeviceProgramsTypeId: entity?.carWashDeviceProgramsTypeId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(incident: Incident): Prisma.IncidentUncheckedCreateInput {
    return {
      id: incident?.id,
      posId: incident.posId,
      workerId: incident.workerId,
      appearanceDate: incident.appearanceDate,
      startDate: incident.startDate,
      finishDate: incident.finishDate,
      objectName: incident.objectName,
      equipmentKnotId: incident?.equipmentKnotId,
      incidentNameId: incident?.incidentNameId,
      incidentReasonId: incident?.incidentReasonId,
      incidentSolutionId: incident?.incidentSolutionId,
      downtime: incident.downtime,
      comment: incident.comment,
      carWashDeviceProgramsTypeId: incident?.carWashDeviceProgramsTypeId,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      createdById: incident.createdById,
      updatedById: incident.updatedById,
    };
  }
}
