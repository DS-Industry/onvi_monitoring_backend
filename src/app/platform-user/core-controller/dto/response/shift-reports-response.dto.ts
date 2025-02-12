export interface ShiftReportsResponseDto {
  shiftReportsData: ShiftReportsDataResponseDto[];
  totalCount: number;
}
export interface ShiftReportsDataResponseDto {
  id: number;
  period: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}
