import { GradingParameter } from '@finance/shiftReport/gradingParameter/domain/gradingParameter';

export abstract class IGradingParameterRepository {
  abstract create(input: GradingParameter): Promise<GradingParameter>;
  abstract findOneById(id: number): Promise<GradingParameter>;
  abstract findAll(): Promise<GradingParameter[]>;
  abstract update(input: GradingParameter): Promise<GradingParameter>;
}
