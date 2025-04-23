import { Injectable } from '@nestjs/common';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { TechTaskItemValueToTechTask } from '@tech-task/itemTemplateToTechTask/domain/itemValueToTechTask';

@Injectable()
export class FindMethodsItemTemplateToTechTaskUseCase {
  constructor(
    private readonly techTaskItemValueToTechTaskRepository: ITechTaskItemValueToTechTaskRepository,
  ) {}

  async findAllByTaskId(
    techTaskId: number,
  ): Promise<TechTaskItemValueToTechTask[]> {
    return await this.techTaskItemValueToTechTaskRepository.findAllByTaskId(
      techTaskId,
    );
  }
}
