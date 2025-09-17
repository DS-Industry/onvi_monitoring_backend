import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@mobile-user/auth/guards/jwt.guard';
import { GetCardOrdersUseCase } from '../use-cases/get-card-orders.use-case';
import { GetCardFreeVacuumUseCase } from '../use-cases/get-card-free-vacuum.use-case';
import { GetCardTariffUseCase } from '../use-cases/get-card-tariff.use-case';
import { GetCardTransferDataUseCase } from '../use-cases/get-card-transfer-data.use-case';
import { PostCardTransferUseCase } from '../use-cases/post-card-transfer.use-case';
import { GetCardVacuumHistoryUseCase } from '../use-cases/get-card-vacuum-history.use-case';
import { HistOptionsDto } from './dto/hist-options.dto';
import { CardTransferDataDto } from './dto/card-transfer-data.dto';
import { CardTransferDto } from './dto/card-transfer.dto';

@Controller('card')
@UseGuards(JwtGuard)
export class CardController {
  constructor(
    private readonly getCardOrdersUseCase: GetCardOrdersUseCase,
    private readonly getCardFreeVacuumUseCase: GetCardFreeVacuumUseCase,
    private readonly getCardTariffUseCase: GetCardTariffUseCase,
    private readonly getCardTransferDataUseCase: GetCardTransferDataUseCase,
    private readonly postCardTransferUseCase: PostCardTransferUseCase,
    private readonly getCardVacuumHistoryUseCase: GetCardVacuumHistoryUseCase,
  ) {}

  @Get('/orders')
  @HttpCode(HttpStatus.OK)
  async getOrdersHistory(
    @Request() request: any,
    @Query() options: HistOptionsDto,
  ): Promise<any> {
    const { size, page } = options;
    const { user } = request;
    return await this.getCardOrdersUseCase.execute(user, size, page);
  }

  @Get('/free-vacuum')
  @HttpCode(HttpStatus.OK)
  async getFreeVacuum(@Request() request: any): Promise<{ limit: number; remains: number }> {
    const { user } = request;
    return await this.getCardFreeVacuumUseCase.execute(user);
  }

  @Get('/vacuum-history')
  @HttpCode(HttpStatus.OK)
  async getVacuumHistory(
    @Request() request: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('deviceType') deviceType?: string,
  ): Promise<any> {
    const { user } = request;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.getCardVacuumHistoryUseCase.execute(user, start, end, deviceType);
  }

  @Get('/tariff')
  @HttpCode(HttpStatus.OK)
  async getTariff(@Request() request: any): Promise<any> {
    const { user } = request;
    return await this.getCardTariffUseCase.execute(user);
  }

  @Get('/transfer')
  @HttpCode(HttpStatus.OK)
  async transferData(
    @Query() query: CardTransferDataDto,
    @Request() request: any,
  ): Promise<any> {
    const { user } = request;
    return await this.getCardTransferDataUseCase.execute(query.devNomer, user);
  }

  @Post('/transfer')
  @HttpCode(HttpStatus.CREATED)
  async transfer(@Body() body: CardTransferDto, @Request() request: any): Promise<any> {
    const { user } = request;
    return await this.postCardTransferUseCase.execute(body, user);
  }
}
