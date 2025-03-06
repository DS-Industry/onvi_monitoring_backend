import { CarWashPosType } from '@prisma/client';

export class PosProgramResponseDto {
  id: number;
  name: string;
  posType?: CarWashPosType;
  programsInfo: PosProgramInfo[];
}

export class PosProgramInfo {
  programName: string;
  counter: number;
  totalTime: number;
  averageTime: string;
  totalProfit?: number;
  averageProfit?: number;
  lastOper?: Date;
}
