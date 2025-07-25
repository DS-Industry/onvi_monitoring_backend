import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { IManagerPaperRepository } from '@manager-paper/managerPaper/interface/managerPaper';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import { CreateDto } from '@manager-paper/managerPaper/use-case/dto/create.dto';
import { User } from '@platform-user/user/domain/user';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CreateManagerPaperUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly managerPaperRepository: IManagerPaperRepository,
  ) {}

  async execute(
    data: CreateDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<ManagerPaper> {
    const managerPaper = new ManagerPaper({
      group: data.group,
      posId: data.posId,
      paperTypeId: data.paperTypeId,
      eventDate: data.eventDate,
      sum: data.sum,
      userId: data.userId,
      comment: data?.comment,
      cashCollectionId: data?.cashCollectionId,
      createdAt: new Date(Date.now()),
      createdById: user.id,
      updatedAt: new Date(Date.now()),
      updatedById: user.id,
    });

    if (file) {
      const key = uuid();
      managerPaper.imageProductReceipt = key;
      const keyWay = `manager-paper/${data.userId}/receipt/` + key;
      await this.fileService.upload(file, keyWay);
    }
    return await this.managerPaperRepository.create(managerPaper);
  }
}
