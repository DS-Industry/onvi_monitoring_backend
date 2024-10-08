import { CarWashPosType } from '@prisma/client';

export interface PosResponseDto {
  id: number;
  name: string;
  slug: string;
  monthlyPlan: number;
  timeWork: string;
  organizationId: number;
  posMetaData: string;
  timezone: number;
  image: string;
  rating: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: number;
  address: {
    id: number;
    city: string;
    location: string;
    lat: number;
    lon: number;
  };
  posType: {
    id: number;
    name: string;
    slug: string;
    carWashPosType: CarWashPosType;
    minSumOrder: number;
    maxSumOrder: number;
    stepSumOrder: number;
  };
}
