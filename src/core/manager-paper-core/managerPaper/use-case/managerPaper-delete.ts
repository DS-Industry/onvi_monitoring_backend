import { Injectable } from '@nestjs/common';
import { IFileAdapter } from '@libs/file/adapter';
import { IManagerPaperRepository } from '@manager-paper/managerPaper/interface/managerPaper';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';

@Injectable()
export class DeleteManagerPaperUseCase {
  constructor(
    private readonly fileService: IFileAdapter,
    private readonly managerPaperRepository: IManagerPaperRepository,
  ) {}

  async execute(input: ManagerPaper): Promise<void> {
    if (input.imageProductReceipt) {
      await this.fileService.delete(
        `manager-paper/${input.userId}/receipt/` + input.imageProductReceipt,
      );
    }
    await this.managerPaperRepository.delete(input.id);
  }

  async executeHandler(cashCollectionId: number): Promise<void> {
    await this.managerPaperRepository.deleteByCashCollection(cashCollectionId);
  }
}
