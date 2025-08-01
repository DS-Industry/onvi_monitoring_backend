import { Injectable } from '@nestjs/common';
import { IGradingParameterRepository } from '@finance/shiftReport/gradingParameter/interface/gradingParameter';
import { GradingParameter } from '@finance/shiftReport/gradingParameter/domain/gradingParameter';

@Injectable()
export class FindMethodsGradingParameterUseCase {
  constructor(
    private readonly gradingParameterRepository: IGradingParameterRepository,
  ) {}

  async getOneById(id: number): Promise<GradingParameter> {
    return await this.gradingParameterRepository.findOneById(id);
  }

  async getAll(): Promise<GradingParameter[]> {
    return await this.gradingParameterRepository.findAll();
  }
}
