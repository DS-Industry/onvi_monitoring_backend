export class DeviceProgramMonitoringResponseDto {
  ownerId: number;
  programName: string;
  counter: number;
  totalTime: number;
  averageTime: number;
  totalProfit?: number;
  averageProfit?: number;
}
