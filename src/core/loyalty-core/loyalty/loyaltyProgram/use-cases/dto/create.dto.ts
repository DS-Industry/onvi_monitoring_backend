export interface CreateDto {
  name: string;
  organizationIds: number[];
  ownerOrganizationId: number;
  lifetimeDays?: number;
}