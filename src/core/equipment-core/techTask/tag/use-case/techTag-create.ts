import { Injectable } from '@nestjs/common';
import { ITechTagRepository } from '@tech-task/tag/interface/techTag';
import { TechTag } from '@tech-task/tag/domain/techTag';

@Injectable()
export class CreateTechTagUseCase {
  constructor(private readonly techTagRepository: ITechTagRepository) {}

  async execute(name: string, code?: string): Promise<TechTag> {
    const techTag = new TechTag({ name: name, code: code });
    return await this.techTagRepository.create(techTag);
  }
}
