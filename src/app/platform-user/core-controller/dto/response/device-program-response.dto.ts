export class DeviceProgramResponseDto {
  prog: ProgramDto[];
  totalCount: number;
}
export class ProgramDto {
  id: number;
  name: string;
  dateBegin: Date;
  dateEnd: Date;
  time: string;
  localId: number;
  payType: string;
  isCar: number;
}
