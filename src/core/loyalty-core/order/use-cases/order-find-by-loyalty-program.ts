import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus, PlatformType, ContractType } from '@prisma/client';
import { LoyaltyProgramOrdersPaginatedResponseDto } from '@platform-user/core-controller/dto/response/loyalty-program-order-response.dto';
import {
  LoyaltyProgramOrderResponseDto,
  BonusOperResponseDto,
  ClientInfoResponseDto,
  CardInfoResponseDto,
  DeviceInfoResponseDto,
  PosInfoResponseDto,
} from '@platform-user/core-controller/dto/response/loyalty-program-order-response.dto';

@Injectable()
export class OrderFindByLoyaltyProgramUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(
    loyaltyProgramId: number,
    page: number = 1,
    size: number = 10,
    filters?: {
      search?: string;
      orderStatus?: OrderStatus;
      platform?: PlatformType;
      contractType?: ContractType;
      dateFrom?: string;
      dateTo?: string;
    },
  ): Promise<LoyaltyProgramOrdersPaginatedResponseDto> {
    const filterParams = {
      ...filters,
      dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    };

    const result = await this.orderRepository.findAllByLoyaltyProgramId(
      loyaltyProgramId,
      page,
      size,
      filterParams,
    );

    const orders: LoyaltyProgramOrderResponseDto[] = result.orders.map(
      (order) => {
        const bonusOpers: BonusOperResponseDto[] = order.bonusOpers.map(
          (oper) => ({
            id: oper.id,
            cardId: oper.cardId,
            carWashDeviceId: oper.carWashDeviceId,
            typeId: oper.typeId,
            operDate: oper.operDate,
            loadDate: oper.loadDate,
            sum: oper.sum,
            comment: oper.comment,
            creatorId: oper.creatorId,
            orderId: oper.orderId,
            type: oper.type
              ? {
                  id: oper.type.id,
                  name: oper.type.name,
                  signOper: oper.type.signOper,
                }
              : null,
          }),
        );

        const client: ClientInfoResponseDto | null = order.card?.client
          ? {
              id: order.card.client.id,
              name: order.card.client.name,
              phone: order.card.client.phone,
              email: order.card.client.email,
              birthday: order.card.client.birthday,
              gender: order.card.client.gender,
            }
          : null;

        const card: CardInfoResponseDto | null = order.card
          ? {
              id: order.card.id,
              unqNumber: order.card.unqNumber,
              number: order.card.number,
              balance: order.card.balance,
            }
          : null;

        const device: DeviceInfoResponseDto | null = order.carWashDevice
          ? {
              id: order.carWashDevice.id,
              name: order.carWashDevice.name,
              carWashDeviceType: order.carWashDevice.carWashDeviceType
                ? {
                    id: order.carWashDevice.carWashDeviceType.id,
                    name: order.carWashDevice.carWashDeviceType.name,
                    code: order.carWashDevice.carWashDeviceType.code,
                  }
                : null,
              pos: order.carWashDevice.carWasPos?.pos
                ? {
                    id: order.carWashDevice.carWasPos.pos.id,
                    name: order.carWashDevice.carWasPos.pos.name,
                  }
                : null,
            }
          : null;

        const pos: PosInfoResponseDto | null =
          order.carWashDevice?.carWasPos?.pos
            ? {
                id: order.carWashDevice.carWasPos.pos.id,
                name: order.carWashDevice.carWasPos.pos.name,
              }
            : null;

        return {
          id: order.id,
          transactionId: order.transactionId,
          sumFull: order.sumFull,
          sumReal: order.sumReal,
          sumBonus: order.sumBonus,
          sumDiscount: order.sumDiscount,
          sumCashback: order.sumCashback,
          carWashDeviceId: order.carWashDeviceId,
          platform: order.platform,
          cardId: order.cardId,
          contractType: order.contractType,
          orderData: order.orderData,
          createData: order.createData,
          orderHandlerStatus: order.orderHandlerStatus,
          orderStatus: order.orderStatus,
          sendAnswerStatus: order.sendAnswerStatus,
          sendTime: order.sendTime,
          debitingMoney: order.debitingMoney,
          executionStatus: order.executionStatus,
          reasonError: order.reasonError,
          executionError: order.executionError,
          handlerError: order.handlerError,
          client,
          card,
          bonusOpers,
          device,
          pos,
        };
      },
    );

    return {
      orders,
      total: result.total,
      page: result.page,
      size: result.size,
      totalPages: result.totalPages,
      hasNext: result.hasNext,
      hasPrevious: result.hasPrevious,
    };
  }
}
