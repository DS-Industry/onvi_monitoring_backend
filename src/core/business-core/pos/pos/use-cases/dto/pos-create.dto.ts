import { CarWashPosType } from '@prisma/client';

export class PosCreateDto {
  name: string;
  monthlyPlan: number;
  timeWork: string;
  posMetaData?: string;
  address: {
    city: string;
    location: string;
    lat?: number;
    lon?: number;
  };
  organizationId: number;
  carWashPosType: CarWashPosType;
  minSumOrder: number;
  maxSumOrder: number;
  stepSumOrder: number;
}
