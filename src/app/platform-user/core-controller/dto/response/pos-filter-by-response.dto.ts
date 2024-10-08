export class PosFilterResponseDto {
  id: number;
  name: string;
  slug: string;
  address: string;
  monthlyPlan: number;
  organizationId: number;
  timeZone: number;
  posStatus: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}
