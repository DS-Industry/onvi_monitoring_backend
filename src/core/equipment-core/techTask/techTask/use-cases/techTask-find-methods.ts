import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask } from '@prisma/client';

@Injectable()
export class FindMethodsTechTaskUseCase {
  constructor(private readonly techTaskRepository: ITechTaskRepository) {}

  async getById(input: number): Promise<TechTask> {
    return await this.techTaskRepository.findOneById(input);
  }

  async getAllByPosId(posId: number): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByPosId(posId);
  }

  async getAllByPosIdAndStatuses(
    posId: number,
    statuses: StatusTechTask[],
  ): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByPosIdAndStatuses(
      posId,
      statuses,
    );
  }

  async getAllByStatus(status: StatusTechTask): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByStatus(status);
  }
}
