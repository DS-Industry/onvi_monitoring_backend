import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { JwtGuard } from '@mobile-user/auth/guards/jwt.guard';
import { CustomHttpException } from '@infra/exceptions/custom-http.exception';
import { GetCardTransactionsHistoryUseCase } from '../use-cases/get-card-transactions-history.use-case';
import { GetFreeVacuumUseCase } from '../use-cases/get-free-vacuum.use-case';
import { GetCardTariffUseCase } from '../use-cases/get-card-tariff.use-case';
import { GetAccountTransferDataUseCase } from '../use-cases/get-account-transfer-data.use-case';
import { TransferAccountUseCase } from '../use-cases/transfer-account.use-case';
import {
  HistOptionsDto,
  AccountTransferDataDto,
  AccountTransferDto,
  AccountTransferDataResponseDto,
} from './dto/card-orders.dto';
import { CardNotMatchExceptions } from '../exceptions/card-not-match.exceptions';
import { AccountNotFoundExceptions } from '@mobile-user/client/exceptions/account-not-found.exceptions';

@Controller('card')
export class CardController {
  constructor(
    private readonly getCardTransactionsHistoryUseCase: GetCardTransactionsHistoryUseCase,
    private readonly getFreeVacuumUseCase: GetFreeVacuumUseCase,
    private readonly getCardTariffUseCase: GetCardTariffUseCase,
    private readonly getAccountTransferDataUseCase: GetAccountTransferDataUseCase,
    private readonly transferAccountUseCase: TransferAccountUseCase,
  ) {}

  @Get('/orders')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getOrdersHistory(
    @Request() request: any,
    @Query() options: HistOptionsDto,
  ): Promise<any> {
    try {
      const { size, page } = options;
      const { user } = request;
      return await this.getCardTransactionsHistoryUseCase.execute(
        user,
        size,
        page,
      );
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @UseGuards(JwtGuard)
  @Get('/free-vacuum')
  @HttpCode(200)
  async getFreeVacuum(
    @Request() request: any,
  ): Promise<{ limit: number; remains: number }> {
    try {
      const { user } = request;
      return await this.getFreeVacuumUseCase.execute(user);
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @UseGuards(JwtGuard)
  @Get('/tariff')
  @HttpCode(200)
  async getAccountNotifications(@Request() request: any): Promise<any> {
    try {
      const { user } = request;
      return await this.getCardTariffUseCase.execute(user);
    } catch (e) {
      if (e instanceof AccountNotFoundExceptions) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: HttpStatus.NOT_FOUND,
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('/transfer')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async transferData(
    @Query() query: AccountTransferDataDto,
    @Request() req: any,
  ): Promise<AccountTransferDataResponseDto> {
    const { user } = req;
    try {
      return await this.getAccountTransferDataUseCase.execute(
        query.devNomer,
        user,
      );
    } catch (e) {
      if (e instanceof CardNotMatchExceptions) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: HttpStatus.NOT_FOUND,
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post('/transfer')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async transfer(@Body() body: AccountTransferDto, @Request() req: any) {
    const { user } = req;
    try {
      return await this.transferAccountUseCase.execute(body, user);
    } catch (e) {
      if (e instanceof CardNotMatchExceptions) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: HttpStatus.NOT_FOUND,
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

