export class IncidentWithInfoDataDto{
  id: number;
  workerId: number;
  posId: number;
  objectName: string;
  appearanceDate: Date;
  startDate: Date;
  finishDate: Date;
  downtime: number;
  equipmentKnot: string;
  incidentName: string;
  incidentReason: string;
  incidentSolution: string;
  comment: string;
  carWashDeviceProgramsTypeId: number;
}