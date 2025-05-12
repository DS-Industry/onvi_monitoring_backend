export interface CreateDto {
  name: string;
  organizationIds: number[];
  lifetimeDays?: number;
}