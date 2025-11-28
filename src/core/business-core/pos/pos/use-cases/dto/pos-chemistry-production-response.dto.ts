export class PosChemistryProductionResponseDto {
  techTaskId: number;
  period: string;
  techRateInfos: TechRateInfoDto[];
}

export class TechRateInfoDto {
  code: string;
  spent: string;
  time: string;
  recalculation: string;
  service: string;
}
