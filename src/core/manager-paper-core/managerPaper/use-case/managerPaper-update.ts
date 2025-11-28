import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { IManagerPaperRepository } from '@manager-paper/managerPaper/interface/managerPaper';
import { UpdateDto } from '@manager-paper/managerPaper/use-case/dto/update.dto';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import { User } from '@platform-user/user/domain/user';
import { v4 as uuid } from 'uuid';
import { ManagerPaperValidationService } from '@manager-paper/managerPaper/validation/managerPaper-validation.service';

@Injectable()
export class UpdateManagerPaperUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly managerPaperRepository: IManagerPaperRepository,
    private readonly managerPaperValidationService: ManagerPaperValidationService,
  ) {}

  async execute(
    input: UpdateDto,
    oldManagerPaper: ManagerPaper,
    user: User,
    file?: Express.Multer.File,
  ): Promise<ManagerPaper> {
    const { group, posId, paperTypeId, eventDate, sum, userId, comment } =
      input;
    const oldUserId = oldManagerPaper.userId;

    const newEventDate = eventDate ? eventDate : oldManagerPaper.eventDate;
    const newUserId = userId ? userId : oldManagerPaper.userId;

    await this.managerPaperValidationService.validatePeriodNotSent(
      newEventDate,
      newUserId,
    );

    oldManagerPaper.group = group ? group : oldManagerPaper.group;
    oldManagerPaper.posId = posId ? posId : oldManagerPaper.posId;
    oldManagerPaper.paperTypeId = paperTypeId
      ? paperTypeId
      : oldManagerPaper.paperTypeId;
    oldManagerPaper.eventDate = eventDate
      ? eventDate
      : oldManagerPaper.eventDate;
    oldManagerPaper.sum = sum ? sum : oldManagerPaper.sum;
    oldManagerPaper.userId = userId ? userId : oldManagerPaper.userId;
    oldManagerPaper.comment = comment ? comment : oldManagerPaper.comment;

    if (file) {
      if (oldManagerPaper.imageProductReceipt) {
        await this.fileService.delete(
          `manager-paper/${oldUserId}/receipt/` +
            oldManagerPaper.imageProductReceipt,
        );
      }
      const key = uuid();
      oldManagerPaper.imageProductReceipt = key;
      const keyWay = `manager-paper/${oldManagerPaper.userId}/receipt/` + key;
      await this.fileService.upload(file, keyWay);
    }

    oldManagerPaper.updatedAt = new Date(Date.now());
    oldManagerPaper.updatedById = user.id;
    return await this.managerPaperRepository.update(oldManagerPaper);
  }
}
