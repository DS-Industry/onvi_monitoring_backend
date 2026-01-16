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
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateMobileOrderUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-create';
import { GetMobileOrderByIdUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-get-by-id';
import { UpdateMobileOrderUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-update';
import { GetMobileOrderByTransactionIdUseCase } from '@loyalty/mobile-user/order/use-cases/mobile-order-get-by-transaction-id';
import { GetActivationWindowsUseCase } from '@loyalty/mobile-user/order/use-cases/get-activation-windows.use-case';
import { CalculateOrderDiscountPreviewUseCase } from '@loyalty/mobile-user/order/use-cases/calculate-order-discount-preview.use-case';
import { GetAvailableMarketingCampaignsUseCase } from '@loyalty/mobile-user/order/use-cases/get-available-marketing-campaigns.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CalculateDiscountDto } from './dto/calculate-discount.dto';
import { JwtGuard } from '@mobile-user/auth/guards/jwt.guard';
import { IPosService } from '@infra/pos/interface/pos.interface';
import { RegisterPaymentUseCase } from '@loyalty/order/use-cases/register-payment.use-case';
import { RegisterPaymentDto } from './dto/register-payment.dto';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { Client } from '@loyalty/mobile-user/client/domain/client';

interface AuthenticatedRequest extends Request {
  user: Client;
}

@Controller('order')
@UseInterceptors(ExceptionInterceptor)
export class OrderController {
  constructor(
    private readonly createMobileOrderUseCase: CreateMobileOrderUseCase,
    private readonly getMobileOrderByIdUseCase: GetMobileOrderByIdUseCase,
    private readonly updateMobileOrderUseCase: UpdateMobileOrderUseCase,
    private readonly getMobileOrderByTransactionIdUseCase: GetMobileOrderByTransactionIdUseCase,
    private readonly getActivationWindowsUseCase: GetActivationWindowsUseCase,
    private readonly calculateOrderDiscountPreviewUseCase: CalculateOrderDiscountPreviewUseCase,
    private readonly getAvailableMarketingCampaignsUseCase: GetAvailableMarketingCampaignsUseCase,
    private readonly posService: IPosService,
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
  ) {}

  @UseGuards(JwtGuard)
  @Post('create')
  @HttpCode(201)
  async createOrder(
    @Body() data: CreateOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;

    return await this.createMobileOrderUseCase.execute({
      sum: data.sum,
      sumBonus: data.sumBonus,
      carWashId: data.carWashId,
      cardMobileUserId: user.id,
      carWashDeviceId: data.carWashDeviceId,
      bayType: data?.bayType ?? null,
      promoCodeId: data?.promoCodeId ?? null,
      rewardPointsUsed: data.rewardPointsUsed ?? 0,
    });
  }

  @UseGuards(JwtGuard)
  @Get('get-activation-windows')
  @HttpCode(HttpStatus.OK)
  async getActivationWindows(@Req() req: AuthenticatedRequest) {
    const { user } = req;
    return await this.getActivationWindowsUseCase.execute({
      ltyUserId: user.id,
    });
  }

  @UseGuards(JwtGuard)
  @Post('calculate-discount')
  @HttpCode(HttpStatus.OK)
  async calculateDiscount(
    @Body() data: CalculateDiscountDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;

    return await this.calculateOrderDiscountPreviewUseCase.execute({
      cardMobileUserId: user.id,
      sum: data.sum,
      sumBonus: data.sumBonus,
      carWashId: data.carWashId,
      carWashDeviceId: data.carWashDeviceId,
      bayType: data?.bayType ?? null,
      promoCodeId: data?.promoCodeId ?? null,
      rewardPointsUsed: data.rewardPointsUsed ?? 0,
    });
  }

  @UseGuards(JwtGuard)
  @Get('marketing-campaigns')
  @HttpCode(HttpStatus.OK)
  async getAvailableMarketingCampaigns(
    @Req() req: AuthenticatedRequest,
    @Query('carWashId') carWashId?: string,
  ) {
    const { user } = req;

    return await this.getAvailableMarketingCampaignsUseCase.execute(
      user.id,
      carWashId ? Number(carWashId) : undefined,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;
    return await this.getMobileOrderByIdUseCase.execute({
      orderId: id,
      clientId: user.id,
    });
  }

  @UseGuards(JwtGuard)
  @Post('status/:id')
  @HttpCode(HttpStatus.OK)
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;
    await this.updateMobileOrderUseCase.execute({
      orderId: id,
      clientId: user.id,
      status: data.status as OrderStatus,
    });
    return { message: 'Order status updated successfully' };
  }

  @Get('transaction/:transactionId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getOrderByTransactionId(
    @Param('transactionId') transactionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;
    return await this.getMobileOrderByTransactionIdUseCase.execute({
      transactionId,
      clientId: user.id,
    });
  }

  @UseGuards(JwtGuard)
  @Post('register')
  @HttpCode(201)
  async registerPayment(
    @Body() data: RegisterPaymentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { user } = req;

    return await this.registerPaymentUseCase.execute({
      ...data,
      clientId: user.id,
    });
  }

  @Get('ping')
  @UseGuards(JwtGuard)
  async pingCarWash(@Query() query: any) {
    const res = await this.posService.ping({
      posId: Number(query.carWashId),
      carWashDeviceId: Number(query.carWashDeviceId),
      type: query?.bayType ?? null,
    });

    return res;
  }

  @Get('/latest')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getLatestCarwash(@Req() request: AuthenticatedRequest, @Query() query: any) {
    return {
      message: 'Get latest carwash - needs implementation',
      query,
    };
  }
}
