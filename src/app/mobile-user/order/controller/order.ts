import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomHttpException } from '@exception/custom-http.exception';
import { CreateMobileOrderUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-create';
import { GetMobileOrderByIdUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-get-by-id';
import { UpdateMobileOrderUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-update';
import { GetMobileOrderByTransactionIdUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-get-by-transaction-id';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtGuard } from '@mobile-user/auth/guards/jwt.guard';
import { IPosService } from '@infra/pos/interface/pos.interface';
import { RegisterPaymentUseCase } from '../use-cases/register-payment.use-case';
import { RegisterPaymentDto } from './dto/register-payment.dto';

@Controller('order')
export class OrderController {
  constructor(
    private readonly createMobileOrderUseCase: CreateMobileOrderUseCase,
    private readonly getMobileOrderByIdUseCase: GetMobileOrderByIdUseCase,
    private readonly updateMobileOrderUseCase: UpdateMobileOrderUseCase,
    private readonly getMobileOrderByTransactionIdUseCase: GetMobileOrderByTransactionIdUseCase,
    private readonly posService: IPosService,
    private readonly registerPaymentUseCase: RegisterPaymentUseCase, 
  ) {}
  @UseGuards(JwtGuard)
  @Post('create')
  @HttpCode(201)
  async createOrder(@Body() data: CreateOrderDto, @Req() req: any) {
    try {
      const { user } = req;
      const transactionId = this.generateTransactionId();

      return await this.createMobileOrderUseCase.execute({
        transactionId,
        sum: data.sum,
        sumBonus: data.sumBonus,
        carWashId: data.carWashId,
        cardMobileUserId: user.props.id,
        bayNumber: data.bayNumber,
        bayType: data?.bayType ?? null,
        promoCodeId: data?.promoCodeId ?? null,
        rewardPointsUsed: data.rewardPointsUsed ?? 0,
      });
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    try {
      const { user } = req;
      return await this.getMobileOrderByIdUseCase.execute({
        orderId: id,
        clientId: user.clientId,
      });
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.NOT_FOUND,
      });
    }
  }

  @UseGuards(JwtGuard)
  @Post('status/:id')
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderStatusDto,
    @Req() req: any,
  ) {
    try {
      const { user } = req;
      await this.updateMobileOrderUseCase.execute({
        orderId: id,
        clientId: user.clientId,
        status: data.status,
      });
      return { message: 'Order status updated successfully' };
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('transaction/:transactionId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getOrderByTransactionId(
    @Param('transactionId') transactionId: string,
    @Req() req: any,
  ) {
    try {
      const { user } = req;
      return await this.getMobileOrderByTransactionIdUseCase.execute({
        transactionId,
        clientId: user.clientId,
      });
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.NOT_FOUND,
      });
    }
  }

  @UseGuards(JwtGuard)
  @Post('register')
  @HttpCode(201)
  async registerPayment(@Body() data: RegisterPaymentDto, @Req() req: any) {
    try {
      return await this.registerPaymentUseCase.execute(data);
    } catch (e: any) {
      if (e?.type && e?.innerCode) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }
      throw new CustomHttpException({
        message: e?.message ?? 'Internal server error',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Get('ping')
  @UseGuards(JwtGuard)
  async pingCarWash(@Query() query: any) {
    const res = await this.posService.ping({
      posId: Number(query.carWashId),
      bayNumber: Number(query.bayNumber),
      type: query?.bayType ?? null,
    });
    
    return res;
  }

  @Get('/latest')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getLatestCarwash(@Req() request: any, @Query() query: any) {
    // TODO
    return {
      message: 'Get latest carwash - needs implementation',
      query,
    };
  }
}

