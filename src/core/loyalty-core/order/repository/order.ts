import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { PrismaService } from '@db/prisma/prisma.service';
import { Order } from '@loyalty/order/domain/order';
import { PrismaOrderMapper } from '@db/mapper/prisma-order-mapper';
import { OrderStatus, PlatformType, UserType } from '@prisma/client';

@Injectable()
export class OrderRepository extends IOrderRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Order): Promise<Order> {
    const orderEntity = PrismaOrderMapper.toPrisma(input);
    const order = await this.prisma.orderMobileUser.create({
      data: orderEntity,
    });
    return PrismaOrderMapper.toDomain(order);
  }

  public async findOneById(id: number): Promise<Order> {
    const order = await this.prisma.orderMobileUser.findFirst({
      where: {
        id,
      },
    });
    return PrismaOrderMapper.toDomain(order);
  }

  public async findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    platformType: PlatformType | '*',
    typeMobileUser: UserType | '*',
    orderStatus: OrderStatus | '*',
    carWashDeviceId: number | '*',
    cardId?: number,
  ): Promise<Order[]> {
    const where: any = {};

    where.orderData = {
      gte: dateStart,
      lte: dateEnd,
    };

    if (platformType !== '*') {
      where.platformType = platformType;
    }

    if (typeMobileUser !== '*') {
      where.typeMobileUser = typeMobileUser;
    }

    if (orderStatus !== '*') {
      where.orderStatus = orderStatus;
    }

    if (carWashDeviceId !== '*') {
      where.carWashDeviceId = carWashDeviceId;
    }

    if (cardId !== undefined) {
      where.carWashDeviceId = cardId;
    }

    const orders = await this.prisma.orderMobileUser.findMany({
      where,
    });
    return orders.map((item) => PrismaOrderMapper.toDomain(item));
  }

  public async update(input: Order): Promise<Order> {
    const orderEntity = PrismaOrderMapper.toPrisma(input);
    const order = await this.prisma.orderMobileUser.update({
      where: {
        id: input.id,
      },
      data: orderEntity,
    });
    return PrismaOrderMapper.toDomain(order);
  }
}
