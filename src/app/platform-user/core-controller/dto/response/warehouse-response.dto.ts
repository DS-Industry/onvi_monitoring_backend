export class WarehouseResponseDto {
  id: number;
  name: string;
  location: string;
  managerId: number;
  managerName?: string;
  posId: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
}
