import { ProgramTechRate } from '@tech-task/programTechRate/domain/programTechRate';

export abstract class IProgramTechRateRepository {
  abstract create(input: ProgramTechRate): Promise<ProgramTechRate>;
  abstract findOneById(id: number): Promise<ProgramTechRate>;
  abstract findOneByCWPosIdAndProgramTypeId(
    carWashPosId: number,
    carWashDeviceProgramsTypeId: number,
  ): Promise<ProgramTechRate>;
  abstract findOneByCWPosIdAndProgramTypeCode(
    carWashPosId: number,
    carWashDeviceProgramsTypeCode: string,
  ): Promise<ProgramTechRate>;
  abstract update(input: ProgramTechRate): Promise<ProgramTechRate>;
  abstract updateValue(
    id: number,
    literRate?: number,
    concentration?: number,
  ): Promise<ProgramTechRate>;
  abstract findAllByPosId(posId: number): Promise<ProgramTechRate[]>;
}
