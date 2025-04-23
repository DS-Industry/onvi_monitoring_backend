import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FindMethodsTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-find-methods';
import { CompletionShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-completion-shape';
import { FindMethodsItemTemplateToTechTaskUseCase } from '@tech-task/itemTemplateToTechTask/use-cases/itemTemplateToTechTask-find-methods';
import { User } from '@platform-user/user/domain/user';
import { TechTaskCompletionShapeValueDto } from '@tech-task/techTask/use-cases/dto/techTask-completion-shape-value.dto';
import { StatusTechTask } from '@prisma/client';

@Injectable()
export class TestDataTechTaskCron {
  constructor(
    private readonly findMethodsTechTaskUseCase: FindMethodsTechTaskUseCase,
    private readonly completionShapeTechTaskUseCase: CompletionShapeTechTaskUseCase,
    private readonly findMethodsItemTemplateToTechTaskUseCase: FindMethodsItemTemplateToTechTaskUseCase,
  ) {}

  @Cron('30 20 * * *')
  async execute(): Promise<void> {
    console.log('start dataTestTechTask');
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

    const techTasks =
      await this.findMethodsTechTaskUseCase.getAllByPosIdAndDate(
        9998,
        startOfDay,
        endOfDay,
        StatusTechTask.ACTIVE,
      );

    console.log(techTasks);
    const user: User = new User({
      id: 7,
      userRoleId: 1,
      name: 'Джон',
      surname: 'Уик',
      email: 'john-wick@mail.ru',
      password: '$2b$10$YofnnPeReckdqb4i9tOcNO5O8.kQhwPO7Uqztl7oK1bNdYvxya7dC',
      position: 'Operator',
    });

    for (const techTask of techTasks) {
      try {
        // 2. Получаем все ItemTemplate для задачи
        const itemTemplates =
          await this.findMethodsItemTemplateToTechTaskUseCase.findAllByTaskId(
            techTask.id,
          );

        console.log(itemTemplates);
        // 3. Формируем массив значений
        const values: TechTaskCompletionShapeValueDto[] = itemTemplates.map(
          (item) => ({
            itemValueId: item.id,
            value: this.getRandomInt(0, 10).toString(),
          }),
        );

        console.log(values);
        // 5. Выполняем завершение задачи
        await this.completionShapeTechTaskUseCase.execute(
          techTask,
          values,
          user,
        );

        console.log(`Successfully completed techTask ${techTask.id}`);
      } catch (error) {
        console.error(`Error processing techTask ${techTask.id}:`, error);
      }
    }

    console.log('end dataTestTechTask');
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
