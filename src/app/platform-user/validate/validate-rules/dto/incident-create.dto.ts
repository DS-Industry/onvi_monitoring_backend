export class IncidentCreateDto {
  posId: number;
  workerId: number;
  equipmentKnotId?: number;
  incidentNameId?: number;
  incidentReasonId?: number;
  incidentSolutionId?: number;
  carWashDeviceProgramsTypeId?: number;
  ability: any;
}
