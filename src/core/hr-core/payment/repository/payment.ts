import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '@hr/payment/interface/payment';
import { PrismaService } from '@db/prisma/prisma.service';
import { Payment } from '@hr/payment/domain/payment';
import { PrismaHrPaymentMapper } from '@db/mapper/prisma-hr-payment-mapper';
import { PaymentType } from '@prisma/client';

@Injectable()
export class PaymentRepository extends IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: Payment): Promise<Payment> {
    const paymentPrismaEntity = PrismaHrPaymentMapper.toPrisma(input);
    const payment = await this.prisma.hrPayment.create({
      data: paymentPrismaEntity,
    });
    return PrismaHrPaymentMapper.toDomain(payment);
  }

  public async createMany(input: Payment[]): Promise<any> {
    const paymentPrismaEntities = input.map(PrismaHrPaymentMapper.toPrisma);

    await this.prisma.hrPayment.createMany({
      data: paymentPrismaEntities,
    });
  }

  public async findOneById(id: number): Promise<Payment> {
    const payment = await this.prisma.hrPayment.findFirst({
      where: {
        id,
      },
    });
    return PrismaHrPaymentMapper.toDomain(payment);
  }

  public async findAllByFilter(
    startPaymentDate?: Date,
    endPaymentDate?: Date,
    hrWorkerId?: number,
    paymentType?: PaymentType,
    billingMonth?: Date,
    skip?: number,
    take?: number,
  ): Promise<Payment[]> {
    const where: any = {};

    if (startPaymentDate !== undefined && endPaymentDate !== undefined) {
      where.paymentDate = {
        gte: startPaymentDate,
        lte: endPaymentDate,
      };
    }

    if (hrWorkerId !== undefined) {
      where.hrWorkerId = hrWorkerId;
    }

    if (paymentType !== undefined) {
      where.paymentType = paymentType;
    }

    if (billingMonth !== undefined) {
      where.billingMonth = billingMonth;
    }

    const payments = await this.prisma.hrPayment.findMany({
      skip: skip ?? undefined,
      take: take ?? undefined,
      where,
      orderBy: {
        paymentDate: 'asc',
      },
    });
    return payments.map((item) => PrismaHrPaymentMapper.toDomain(item));
  }

  public async findAllForCalculate(
    hrWorkerIds: number[],
    paymentType: PaymentType,
    billingMonth: Date,
  ): Promise<Payment[]> {
    const payments = await this.prisma.hrPayment.findMany({
      where: {
        hrWorkerId: { in: hrWorkerIds },
        paymentType,
        ...(billingMonth !== undefined && { billingMonth }),
      },
    });

    return payments.map((payment) => PrismaHrPaymentMapper.toDomain(payment));
  }

  public async findCountByFilter(
    startPaymentDate?: Date,
    endPaymentDate?: Date,
    hrWorkerId?: number,
    paymentType?: PaymentType,
    billingMonth?: Date,
  ): Promise<number> {
    const where: any = {};

    if (startPaymentDate !== undefined && endPaymentDate !== undefined) {
      where.paymentDate = {
        gte: startPaymentDate,
        lte: endPaymentDate,
      };
    }

    if (hrWorkerId !== undefined) {
      where.hrWorkerId = hrWorkerId;
    }

    if (paymentType !== undefined) {
      where.paymentType = paymentType;
    }

    if (billingMonth !== undefined) {
      where.billingMonth = billingMonth;
    }

    return await this.prisma.hrPayment.count({
      where,
    });
  }

  public async update(input: Payment): Promise<Payment> {
    const paymentPrismaEntity = PrismaHrPaymentMapper.toPrisma(input);
    const payment = await this.prisma.hrPayment.update({
      where: {
        id: input.id,
      },
      data: paymentPrismaEntity,
    });
    return PrismaHrPaymentMapper.toDomain(payment);
  }
}
