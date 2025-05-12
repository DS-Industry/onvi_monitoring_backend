import { HrPayment as PrismaHrPayment, Prisma } from '@prisma/client';
import { Payment } from '@hr/payment/domain/payment';

export class PrismaHrPaymentMapper {
  static toDomain(entity: PrismaHrPayment): Payment {
    if (!entity) {
      return null;
    }
    return new Payment({
      id: entity.id,
      hrWorkerId: entity.hrWorkerId,
      paymentType: entity.paymentType,
      paymentDate: entity.paymentDate,
      billingMonth: entity.billingMonth,
      countShifts: entity.countShifts,
      sum: entity.sum,
      prize: entity.prize,
      fine: entity.fine,
      createdAt: entity.createdAt,
      createdById: entity.createdById,
      updatedAt: entity.updatedAt,
      updatedById: entity.updatedById,
    });
  }

  static toPrisma(payment: Payment): Prisma.HrPaymentUncheckedCreateInput {
    return {
      id: payment?.id,
      hrWorkerId: payment.hrWorkerId,
      paymentType: payment.paymentType,
      paymentDate: payment.paymentDate,
      billingMonth: payment.billingMonth,
      countShifts: payment.countShifts,
      sum: payment.sum,
      prize: payment.prize,
      fine: payment.fine,
      createdAt: payment.createdAt,
      createdById: payment.createdById,
      updatedAt: payment.updatedAt,
      updatedById: payment.updatedById,
    };
  }
}
