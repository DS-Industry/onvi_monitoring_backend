export class IncidentGetAllByFilterResponseDto {
  id: number;
  workerId: number;
  posId: number;
  objectName: string;
  appearanceDate: Date;
  startDate: Date;
  finishDate: Date;
  repair: string;
  equipmentKnot: string;
  incidentName: string;
  incidentReason: string;
  incidentSolution: string;
  downtime: string;
  comment: string;
  programId: number;
}
