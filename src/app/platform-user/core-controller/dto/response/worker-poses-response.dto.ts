export interface WorkerPosesResponseDto {
  id: number;
  name: string;
  slug: string;
  organizationId: number;
  status: string;
  address?: {
    id: number;
    city: string;
    location: string;
  };
}

export interface WorkerPosesListResponseDto {
  poses: WorkerPosesResponseDto[];
  totalCount: number;
}
