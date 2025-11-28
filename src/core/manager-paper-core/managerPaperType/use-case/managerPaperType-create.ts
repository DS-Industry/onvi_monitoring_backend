import { Injectable } from '@nestjs/common';
import { IManagerPaperTypeRepository } from '@manager-paper/managerPaperType/interface/managerPaperType';
import { CreateDto } from '@manager-paper/managerPaperType/use-case/dto/create.dto';
import { ManagerPaperType } from '@manager-paper/managerPaperType/domain/managerPaperType';

@Injectable()
export class CreateManagerPaperTypeUseCase {
  constructor(
    private readonly managerPaperTypeRepository: IManagerPaperTypeRepository,
  ) {}

  async execute(input: CreateDto): Promise<ManagerPaperType> {
    const managerPaperType = new ManagerPaperType({
      name: input.name,
      type: input.type,
    });
    return await this.managerPaperTypeRepository.create(managerPaperType);
  }
}
