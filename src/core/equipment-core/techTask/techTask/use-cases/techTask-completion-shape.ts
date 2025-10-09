import { Injectable } from '@nestjs/common';
import { ITechTaskRepository } from '@tech-task/techTask/interface/techTask';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { TechTaskCompletionShapeValueDto } from '@tech-task/techTask/use-cases/dto/techTask-completion-shape-value.dto';
import { ITechTaskItemValueToTechTaskRepository } from '@tech-task/itemTemplateToTechTask/interface/itemValueToTechTask';
import { StatusTechTask, TypeTechTask } from '@prisma/client';
import { User } from '@platform-user/user/domain/user';
import { IFileAdapter } from '@libs/file/adapter';
import { v4 as uuid } from 'uuid';
import { PeriodCalculator } from '../utils/period-calculator';

@Injectable()
export class CompletionShapeTechTaskUseCase {
  constructor(
    private readonly techTaskRepository: ITechTaskRepository,
    private readonly techTaskItemValueToTechTaskRepository: ITechTaskItemValueToTechTaskRepository,
    private readonly fileService: IFileAdapter,
  ) {}

  async execute(
    techTask: TechTask,
    value: TechTaskCompletionShapeValueDto[],
    user: User,
  ): Promise<TechTask> {
    for (const itemValue of value) {
      let key: string;
      if (itemValue.file) {
        key = uuid();
        const keyWay = `image/pos/${techTask.posId}/techTask/${techTask.id}/${itemValue.itemValueId}/${key}`;
        await this.fileService.upload(itemValue.file, keyWay);
      }
      await this.techTaskItemValueToTechTaskRepository.updateValue(
        itemValue.itemValueId,
        itemValue.value,
        key,
      );
    } 
    techTask.status = StatusTechTask.FINISHED;
    techTask.sendWorkDate = new Date();
    techTask.executorId = user.id;
    
    if (techTask.type === TypeTechTask.REGULAR && techTask.nextCreateDate && techTask.periodType) {
      techTask.nextCreateDate = PeriodCalculator.calculateNextDate(
        techTask.nextCreateDate, 
        techTask.periodType, 
        techTask.customPeriodDays
      );
    }
    
    return await this.techTaskRepository.update(techTask);
  }
}
