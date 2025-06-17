export class PosPlanFactResponseDto {
  plan: PosPlanFactDto[];
  totalCount: number;
}

export class PosPlanFactDto {
  posId: number;
  plan: number;
  cashFact: number;
  virtualSumFact: number;
  yandexSumFact: number;
  sumFact: number;
  completedPercent: number;
  notCompletedPercent: number;
}
