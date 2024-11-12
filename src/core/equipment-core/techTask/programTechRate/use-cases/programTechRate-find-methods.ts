import { Injectable } from '@nestjs/common';
import { IProgramTechRateRepository } from '@tech-task/programTechRate/interface/programTechRate';
import { ProgramTechRate } from '@tech-task/programTechRate/domain/programTechRate';

@Injectable()
export class FindMethodsProgramTechRateUseCase {
  constructor(
    private readonly programTechRateRepository: IProgramTechRateRepository,
  ) {}

  async getById(input: number): Promise<ProgramTechRate> {
    return await this.programTechRateRepository.findOneById(input);
  }

  async getByCWPosIdAndProgramTypeId(
    carWashPosId: number,
    carWashDeviceProgramsTypeId: number,
  ): Promise<ProgramTechRate> {
    return await this.programTechRateRepository.findOneByCWPosIdAndProgramTypeId(
      carWashPosId,
      carWashDeviceProgramsTypeId,
    );
  }

  async getByCWPosIdAndProgramTypeCode(
    carWashPosId: number,
    carWashDeviceProgramsTypeCode: string,
  ): Promise<ProgramTechRate> {
    return await this.programTechRateRepository.findOneByCWPosIdAndProgramTypeCode(
      carWashPosId,
      carWashDeviceProgramsTypeCode,
    );
  }
}
