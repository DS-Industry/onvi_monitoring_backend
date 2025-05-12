import { Injectable } from '@nestjs/common';
import { ITechTagRepository } from '@tech-task/tag/interface/techTag';
import { TechTag } from '@tech-task/tag/domain/techTag';

@Injectable()
export class FindMethodsTechTagUseCase {
  constructor(private readonly techTagRepository: ITechTagRepository) {}

  async getAll(): Promise<TechTag[]> {
    return await this.techTagRepository.findAll();
  }

  async getById(id: number): Promise<TechTag> {
    return await this.techTagRepository.findOneById(id);
  }

  async getByName(name: string): Promise<TechTag> {
    return await this.techTagRepository.findOneByName(name);
  }

  async getAllByTechTaskId(techTaskId: number): Promise<TechTag[]> {
    return await this.techTagRepository.findAllByTechTaskId(techTaskId);
  }
}
