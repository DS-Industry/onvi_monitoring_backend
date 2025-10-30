import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { PrismaService } from '@db/prisma/prisma.service';
import { Order } from '@loyalty/order/domain/order';
import { PrismaOrderMapper } from '@db/mapper/prisma-order-mapper';
import { OrderStatus, PlatformType, ContractType } from '@prisma/client';

@Injectable()
export class OrderRepository extends IOrderRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Order): Promise<Order> {
    const orderEntity = PrismaOrderMapper.toPrisma(input);
    const order = await this.prisma.lTYOrder.create({
      data: orderEntity,
      include: {
        carWashDevice: {
          include: {
            carWashDeviceType: true,
          },
        }
      },
    });
    return PrismaOrderMapper.toDomain(order);
  }

  public async findOneById(id: number): Promise<Order> {
    const order = await this.prisma.lTYOrder.findFirst({
      where: {
        id,
      },
      include: {
        carWashDevice: {
          include: {
            carWashDeviceType: true,
          },
        }
      },
    });
    return PrismaOrderMapper.toDomain(order);
  }

  public async findOneByTransactionId(transactionId: string): Promise<Order> {
    const order = await this.prisma.lTYOrder.findFirst({
      include: {
        carWashDevice: {
          include: {
            carWashDeviceType: true,
          },
        }
      },
      where: {
        transactionId,
      },
    });
    return PrismaOrderMapper.toDomain(order);
  }

  public async findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    platformType?: PlatformType,
    typeMobileUser?: ContractType,
    orderStatus?: OrderStatus,
    carWashDeviceId?: number,
    cardId?: number,
    deviceTypeCode?: string,
  ): Promise<Order[]> {
    const where: any = {};

    where.orderData = {
      gte: dateStart,
      lte: dateEnd,
    };

    if (platformType !== undefined) {
      where.platformType = platformType;
    }

    if (typeMobileUser !== undefined) {
      where.typeMobileUser = typeMobileUser;
    }

    if (orderStatus !== undefined) {
      where.orderStatus = orderStatus;
    }

    if (carWashDeviceId !== undefined) {
      where.carWashDeviceId = carWashDeviceId;
    }

    if (cardId !== undefined) {
      where.cardId = cardId;
    }

    if (deviceTypeCode !== undefined) {
      where.carWashDevice = {
        carWashDeviceType: {
          code: deviceTypeCode,
        },
      } as any;
    }

    const orders = await this.prisma.lTYOrder.findMany({
      where,
      include: {
        carWashDevice: {
          include: {
            carWashDeviceType: true,
          },
        }
      },
    });
    return orders.map((item) => PrismaOrderMapper.toDomain(item));
  }

  public async update(input: Order): Promise<Order> {
    const orderEntity = PrismaOrderMapper.toPrisma(input);
    const order = await this.prisma.lTYOrder.update({
      where: {
        id: input.id,
      },
      data: orderEntity,
      include: {
        carWashDevice: {
          include: {
            carWashDeviceType: true,
          },
        }
      },
    });
    return PrismaOrderMapper.toDomain(order);
  }
}
