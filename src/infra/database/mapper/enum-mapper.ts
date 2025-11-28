import {
  OrderStatus as PrismaOrderStatus,
  PlatformType as PrismaPlatformType,
  ContractType as PrismaContractType,
  OrderHandlerStatus as PrismaOrderHandlerStatus,
  ExecutionStatus as PrismaExecutionStatus,
  SendAnswerStatus as PrismaSendAnswerStatus,
  StatusUser as PrismaStatusUser,
  LTYProgramStatus as PrismaLTYProgramStatus,
} from '@prisma/client';
import {
  OrderStatus,
  PlatformType,
  ContractType,
  OrderHandlerStatus,
  ExecutionStatus,
  SendAnswerStatus,
} from '@loyalty/order/domain/enums';
import { StatusUser } from '@loyalty/mobile-user/client/domain/enums';
import { LTYProgramStatus } from '@loyalty/loyalty/loyaltyProgram/domain/enums';

/**
 * Maps Prisma enums to Domain enums
 */
export class EnumMapper {
  static toDomainOrderStatus(status: PrismaOrderStatus): OrderStatus {
    return status as OrderStatus;
  }

  static toPrismaOrderStatus(status: OrderStatus): PrismaOrderStatus {
    return status as PrismaOrderStatus;
  }

  static toDomainPlatformType(type: PrismaPlatformType): PlatformType {
    return type as PlatformType;
  }

  static toPrismaPlatformType(type: PlatformType): PrismaPlatformType {
    return type as PrismaPlatformType;
  }

  static toDomainContractType(type: PrismaContractType): ContractType {
    return type as ContractType;
  }

  static toPrismaContractType(type: ContractType): PrismaContractType {
    return type as PrismaContractType;
  }

  static toDomainOrderHandlerStatus(
    status: PrismaOrderHandlerStatus,
  ): OrderHandlerStatus {
    return status as OrderHandlerStatus;
  }

  static toPrismaOrderHandlerStatus(
    status: OrderHandlerStatus,
  ): PrismaOrderHandlerStatus {
    return status as PrismaOrderHandlerStatus;
  }

  static toDomainExecutionStatus(
    status: PrismaExecutionStatus,
  ): ExecutionStatus | undefined {
    return status ? (status as ExecutionStatus) : undefined;
  }

  static toPrismaExecutionStatus(
    status: ExecutionStatus | undefined,
  ): PrismaExecutionStatus | undefined {
    return status ? (status as PrismaExecutionStatus) : undefined;
  }

  static toDomainSendAnswerStatus(
    status: PrismaSendAnswerStatus,
  ): SendAnswerStatus | undefined {
    return status ? (status as SendAnswerStatus) : undefined;
  }

  static toPrismaSendAnswerStatus(
    status: SendAnswerStatus | undefined,
  ): PrismaSendAnswerStatus | undefined {
    return status ? (status as PrismaSendAnswerStatus) : undefined;
  }

  static toDomainStatusUser(status: PrismaStatusUser): StatusUser {
    return status as StatusUser;
  }

  static toPrismaStatusUser(
    status: StatusUser | undefined,
  ): PrismaStatusUser | undefined {
    return status ? (status as PrismaStatusUser) : undefined;
  }

  static toDomainLTYProgramStatus(
    status: PrismaLTYProgramStatus,
  ): LTYProgramStatus {
    return status as LTYProgramStatus;
  }

  static toPrismaLTYProgramStatus(
    status: LTYProgramStatus,
  ): PrismaLTYProgramStatus {
    return status as PrismaLTYProgramStatus;
  }
}
