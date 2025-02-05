import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { FinanceException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { CashCollectionCreateDto } from '@platform-user/core-controller/dto/receive/cash-collection-create.dto';
import { CashCollectionResponseDto } from '@platform-user/core-controller/dto/response/cash-collection-response.dto';

@Controller('finance')
export class FinanceController {
  constructor() {}
  //CreateCashCollection
  @Post('cash-collection')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async createCashCollection(
    @Body() data: CashCollectionCreateDto,
    @Request() req: any,
  ): Promise<CashCollectionResponseDto> {
    try {
      const { user, ability } = req;
      return {
        id: 1,
        cashCollectionDate: data.cashCollectionDate,
        oldCashCollectionDate: data.cashCollectionDate,
        status: 'SAVED',
        sumFact: 100,
        virtualSum: 100,
        sumCard: 100,
        shortage: 100,
        countCar: 100,
        countCarCard: 100,
        averageCheck: 100,
        cashCollectionDeviceType: [
          {
            id: 1,
            typeName: 'Моечные посты',
            sumCoinDeviceType: 100,
            sumPaperDeviceType: 100,
            sumFactDeviceType: 100,
            shortageDeviceType: 100,
            virtualSumDeviceType: 100,
          },
          {
            id: 2,
            typeName: 'Пылесосы',
            sumCoinDeviceType: 100,
            sumPaperDeviceType: 100,
            sumFactDeviceType: 100,
            shortageDeviceType: 100,
            virtualSumDeviceType: 100,
          },
        ],
        cashCollectionDevice: [
          {
            id: 1,
            deviceId: 1,
            deviceName: 'Пост 1',
            deviceType: 'Пост',
            oldTookMoneyTime: data.cashCollectionDate,
            tookMoneyTime: data.cashCollectionDate,
            sumDevice: 100,
            sumCoinDevice: 100,
            sumPaperDevice: 100,
            virtualSumDevice: 100,
          },
          {
            id: 2,
            deviceId: 2,
            deviceName: 'Пылесос 1',
            deviceType: 'Пылесос',
            oldTookMoneyTime: data.cashCollectionDate,
            tookMoneyTime: data.cashCollectionDate,
            sumDevice: 100,
            sumCoinDevice: 100,
            sumPaperDevice: 100,
            virtualSumDevice: 100,
          },
        ],
      };
    } catch (e) {
      if (e instanceof FinanceException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
