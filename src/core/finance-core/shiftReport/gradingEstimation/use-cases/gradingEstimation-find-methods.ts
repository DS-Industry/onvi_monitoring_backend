import { Injectable } from '@nestjs/common';
import { IGradingEstimationRepository } from '@finance/shiftReport/gradingEstimation/interface/gradingEstimation';
import { GradingEstimation } from '@finance/shiftReport/gradingEstimation/domain/gradingEstimation';

@Injectable()
export class FindMethodsGradingEstimationUseCase {
  constructor(
    private readonly gradingEstimationRepository: IGradingEstimationRepository,
  ) {}

  async getOneById(id: number): Promise<GradingEstimation> {
    return await this.gradingEstimationRepository.findOneById(id);
  }

  async getAll(): Promise<GradingEstimation[]> {
    return await this.gradingEstimationRepository.findAll();
  }
}
