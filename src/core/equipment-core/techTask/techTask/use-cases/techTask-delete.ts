import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';

@Injectable()
export class DeleteTechTaskUseCase {
  constructor(private readonly techTaskRepository: ITechTaskRepository) {}

  async execute(techTask: TechTask): Promise<void> {
    await this.techTaskRepository.delete(techTask.id);
  }
}
