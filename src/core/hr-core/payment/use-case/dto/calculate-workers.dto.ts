export interface CalculateWorkersDto {
  organizationId: number;
  billingMonth: Date;
  workerIds: number[];
}
