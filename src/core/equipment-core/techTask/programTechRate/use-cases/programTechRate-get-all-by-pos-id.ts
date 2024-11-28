import { Injectable } from '@nestjs/common';
import { FindMethodsProgramTechRateUseCase } from '@tech-task/programTechRate/use-cases/programTechRate-find-methods';
import { DeviceProgramType } from '@pos/device/device-data/device-data/device-program/device-program-type/domain/device-program-type';
import { ProgramTechRateGetAllByPosIdResponseDto } from '@tech-task/programTechRate/use-cases/dto/programTechRate-get-all-by-pos-id-response.dto';
import { IProgramTechRateRepository } from '@tech-task/programTechRate/interface/programTechRate';
import { ProgramTechRate } from '@tech-task/programTechRate/domain/programTechRate';

@Injectable()
export class GetAllByPosIdProgramTechRateUseCase {
  constructor(
    private readonly findMethodsProgramTechRateUseCase: FindMethodsProgramTechRateUseCase,
    private readonly programTechRateRepository: IProgramTechRateRepository,
  ) {}

  async execute(
    programTypes: DeviceProgramType[],
    posId: number,
  ): Promise<ProgramTechRateGetAllByPosIdResponseDto[]> {
    const response: ProgramTechRateGetAllByPosIdResponseDto[] = [];
    await Promise.all(
      programTypes.map(async (programType) => {
        let programRate =
          await this.findMethodsProgramTechRateUseCase.getByCWPosIdAndProgramTypeId(
            posId,
            programType.id,
          );
        if (!programRate) {
          const programRateData = new ProgramTechRate({
            carWashPosId: posId,
            carWashDeviceProgramsTypeId: programType.id,
          });
          programRate =
            await this.programTechRateRepository.create(programRateData);
        }
        response.push({
          id: programRate.id,
          programTypeName: programType.name,
          literRate: programRate.literRate,
          concentration: programRate.concentration,
        });
      }),
    );
    return response;
  }
}
