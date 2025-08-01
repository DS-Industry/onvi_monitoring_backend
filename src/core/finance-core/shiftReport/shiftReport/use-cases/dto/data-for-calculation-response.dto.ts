export class DataForCalculationResponseDto {
  workerId: number;
  shiftReportId: number;
  gradingData: {
    parameterWeightPercent: number;
    estimationWeightPercent: number;
  }[];
}
