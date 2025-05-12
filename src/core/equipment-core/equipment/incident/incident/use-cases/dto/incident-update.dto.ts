export class IncidentUpdateDto {
  workerId?: number;
  appearanceDate?: Date;
  startDate?: Date;
  finishDate?: Date;
  objectName?: string;
  equipmentKnotId?: number;
  incidentNameId?: number;
  incidentReasonId?: number;
  incidentSolutionId?: number;
  downtime?: number;
  comment?: string;
  carWashDeviceProgramsTypeId?: number;
}