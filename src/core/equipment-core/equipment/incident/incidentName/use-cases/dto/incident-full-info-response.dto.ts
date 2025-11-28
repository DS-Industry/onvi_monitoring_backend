export class IncidentFullInfoResponseDto {
  id: number;
  problemName: string;
  reason: IncidentInfoDto[];
  solution: IncidentInfoDto[];
}

export class IncidentInfoDto {
  id: number;
  infoName: string;
}
