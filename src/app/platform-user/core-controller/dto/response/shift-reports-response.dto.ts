export interface ShiftReportsResponseDto {
  shiftReportsData: ShiftReportsDataResponseDto[];
  totalCount: number;
}
export interface ShiftReportsDataResponseDto {
  id: number;
  posId: number;
  period: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}
