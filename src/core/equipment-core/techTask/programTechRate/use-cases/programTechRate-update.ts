import { Injectable } from '@nestjs/common';
import { IProgramTechRateRepository } from '@tech-task/programTechRate/interface/programTechRate';
import { ProgramTechRateUpdateDto } from '@tech-task/programTechRate/use-cases/dto/programTechRate-update.dto';
import { ProgramTechRate } from '@tech-task/programTechRate/domain/programTechRate';

@Injectable()
export class UpdateProgramTechRateUseCase {
  constructor(
    private readonly programTechRateRepository: IProgramTechRateRepository,
  ) {}

  async execute(value: ProgramTechRateUpdateDto[]): Promise<ProgramTechRate[]> {
    const response: ProgramTechRate[] = [];
    await Promise.all(
      value.map(async (techRate) =>
        response.push(
          await this.programTechRateRepository.updateValue(
            techRate.programTechRateId,
            techRate.literRate,
            techRate.concentration,
          ),
        ),
      ),
    );
    return response;
  }
}
