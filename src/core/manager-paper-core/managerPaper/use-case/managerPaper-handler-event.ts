import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-create';
import { OnEvent } from '@nestjs/event-emitter';
import { CustomHttpException } from '@exception/custom-http.exception';
import { CreateEventDto } from '@manager-paper/managerPaper/use-case/dto/create-event.dto';
import { ManagerPaperGroup } from '@prisma/client';
import { FindMethodsManagerPaperTypeUseCase } from '@manager-paper/managerPaperType/use-case/managerPaperType-find-methods';
import { DeleteManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-delete';
import { CreateEventSaleDocumentDto } from '@manager-paper/managerPaper/use-case/dto/create-event-sale-document.dto';

@Injectable()
export class ManagerPaperHandlerEventUseCase {
  constructor(
    private readonly createManagerPaperUseCase: CreateManagerPaperUseCase,
    private readonly findMethodsManagerPaperTypeUseCase: FindMethodsManagerPaperTypeUseCase,
    private readonly deleteManagerPaperUseCase: DeleteManagerPaperUseCase,
  ) {}

  @OnEvent('manager-paper.created-cash-collection')
  async handlerManagerPaperCreatedEvent(payload: CreateEventDto) {
    try {
      const managerPaperType =
        await this.findMethodsManagerPaperTypeUseCase.getOneByName(
          'Инкассация',
        );
      await this.createManagerPaperUseCase.execute(
        {
          group: ManagerPaperGroup.REVENUE,
          posId: payload.posId,
          paperTypeId: managerPaperType.id,
          eventDate: payload.eventDate,
          sum: payload.sum,
          userId: payload.user.id,
          cashCollectionId: payload.cashCollectionId,
        },
        payload.user,
      );
    } catch (error) {
      throw new CustomHttpException({
        message: error.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @OnEvent('manager-paper.created-sale-document')
  async handlerManagerPaperCreatedSaleDocumentEvent(
    payload: CreateEventSaleDocumentDto,
  ) {
    try {
      const managerPaperType =
        await this.findMethodsManagerPaperTypeUseCase.getOneByName('Продажа');
      await this.createManagerPaperUseCase.execute(
        {
          group: ManagerPaperGroup.REVENUE,
          posId: payload.posId,
          paperTypeId: managerPaperType.id,
          eventDate: payload.eventDate,
          sum: payload.sum,
          userId: payload.user.id,
        },
        payload.user,
      );
    } catch (error) {
      throw new CustomHttpException({
        message: error.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @OnEvent('manager-paper.delete-cash-collection')
  async handlerManagerPaperDeleteEvent(payload: { cashCollectionId: number }) {
    try {
      await this.deleteManagerPaperUseCase.executeHandler(
        payload.cashCollectionId,
      );
    } catch (error) {
      throw new CustomHttpException({
        message: error.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
