export interface CreateDto {
  name: string;
  description?: string;
  maxLevels: number;
  ownerOrganizationId: number;
  lifetimeDays?: number;
}
