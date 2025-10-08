import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';

@Injectable()
export class DeleteManyTechTaskUseCase {
  constructor(private readonly techTaskRepository: ITechTaskRepository) {}

  async execute(techTasks: TechTask[]): Promise<void> {
    const ids = techTasks.map(task => task.id);
    await this.techTaskRepository.deleteMany(ids);
  }
}
