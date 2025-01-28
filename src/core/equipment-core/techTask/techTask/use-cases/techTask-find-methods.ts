import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';

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

  async getAllAllByPosIdAndDate(
    posId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByPosIdAndDate(
      posId,
      dateStart,
      dateEnd,
    );
  }

  async getAllAllByTypeAndPosIdAndDate(
    posId: number,
    type: TypeTechTask,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByTypeAndPosIdAndDate(
      posId,
      type,
      dateStart,
      dateEnd,
    );
  }

  async getAllByStatus(status: StatusTechTask): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllByStatus(status);
  }

  async getAllForHandler(): Promise<TechTask[]> {
    return await this.techTaskRepository.findAllForHandler();
  }
}
