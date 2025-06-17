import { CarWashPosType } from '@prisma/client';

export class PosCreateDto {
  name: string;
  timeWork: string;
  posMetaData?: string;
  address: {
    city: string;
    location: string;
    lat?: string;
    lon?: string;
  };
  organizationId: number;
  carWashPosType: CarWashPosType;
  minSumOrder: number;
  maxSumOrder: number;
  stepSumOrder: number;
}
