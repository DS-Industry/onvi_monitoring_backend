import { GradingEstimation } from '@finance/shiftReport/gradingEstimation/domain/gradingEstimation';

export abstract class IGradingEstimationRepository {
  abstract create(input: GradingEstimation): Promise<GradingEstimation>;
  abstract findOneById(id: number): Promise<GradingEstimation>;
  abstract findAll(): Promise<GradingEstimation[]>;
  abstract update(input: GradingEstimation): Promise<GradingEstimation>;
}
