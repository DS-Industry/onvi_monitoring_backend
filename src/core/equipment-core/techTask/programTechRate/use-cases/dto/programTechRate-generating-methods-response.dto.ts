export class ProgramTechRateGeneratingMethodsResponseDto {
  techTaskId: number;
  posId: number;
  dateStart: Date;
  dateEnd: Date;
  techRateInfos: TechRateInfoDto[];
}

export class TechRateInfoDto {
  code: string;
  spent: number;
  coef: number;
  service: string;
}