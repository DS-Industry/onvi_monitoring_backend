export class CleanDataResponseDto {
  deviceId: number;
  programData: ProgramDataDto[];
}

export class ProgramDataDto {
  programName: string;
  countProgram: number;
  time: string;
}
