import { Injectable } from '@nestjs/common';
import { IManagerPaperTypeRepository } from '@manager-paper/managerPaperType/interface/managerPaperType';
import { UpdateDto } from '@manager-paper/managerPaperType/use-case/dto/update.dto';
import { ManagerPaperType } from '@manager-paper/managerPaperType/domain/managerPaperType';

@Injectable()
export class UpdateManagerPaperTypeUseCase {
  constructor(
    private readonly managerPaperTypeRepository: IManagerPaperTypeRepository,
  ) {}

  async execute(
    input: UpdateDto,
    oldManagerPaperType: ManagerPaperType,
  ): Promise<ManagerPaperType> {
    const { name, type } = input;

    oldManagerPaperType.name = name ? name : oldManagerPaperType.name;
    oldManagerPaperType.type = type ? type : oldManagerPaperType.type;

    return await this.managerPaperTypeRepository.update(oldManagerPaperType);
  }
}
