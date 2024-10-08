export class PosProgramResponseDto {
  id: number;
  name: string;
  programsInfo: PosProgramInfo[];
}

export class PosProgramInfo {
  programName: string;
  counter: number;
  totalTime: number;
  averageTime: string;
  lastOper: Date;
}
