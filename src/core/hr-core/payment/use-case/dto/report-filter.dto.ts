export interface ReportFilterDto {
  startPaymentDate?: Date;
  endPaymentDate?: Date;
  hrWorkerId?: number;
  billingMonth?: Date;
  skip?: number;
  take?: number;
}
