import { Injectable } from '@nestjs/common';
import { ITechTaskItemTemplateRepository } from '@tech-task/itemTemplate/interface/itemTemplate';
import { TechTaskItemTemplate } from "@tech-task/itemTemplate/domain/itemTemplate";

@Injectable()
export class FindMethodsItemTemplateUseCase {
  constructor(
    private readonly itemTemplateRepository: ITechTaskItemTemplateRepository,
  ) {}

  async getById(input: number): Promise<TechTaskItemTemplate> {
    return await this.itemTemplateRepository.findOneById(input);
  }
}
