import { OrderStatus, PlatformType, ContractType, OrderHandlerStatus, SendAnswerStatus, ExecutionStatus } from '@prisma/client';

export class BonusOperResponseDto {
  id: number;
  cardId?: number | null;
  carWashDeviceId?: number | null;
  typeId?: number | null;
  operDate: Date;
  loadDate: Date;
  sum: number;
  comment?: string | null;
  creatorId?: number | null;
  orderId?: number | null;
  type?: {
    id: number;
    name: string;
    signOper: string;
  } | null;
}

export class ClientInfoResponseDto {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  birthday?: Date | null;
  gender?: string | null;
}

export class CardInfoResponseDto {
  id: number;
  unqNumber: string;
  number: string;
  balance: number;
}

export class PosInfoResponseDto {
  id: number;
  name: string;
}

export class DeviceInfoResponseDto {
  id: number;
  name: string;
  carWashDeviceType?: {
    id: number;
    name: string;
    code: string;
  } | null;
  pos?: PosInfoResponseDto | null;
}

export class LoyaltyProgramOrderResponseDto {
  id: number;
  transactionId?: string | null;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  carWashDeviceId: number;
  platform: PlatformType;
  cardId?: number | null;
  contractType: ContractType;
  orderData: Date;
  createData: Date;
  orderHandlerStatus?: OrderHandlerStatus | null;
  orderStatus: OrderStatus;
  sendAnswerStatus?: SendAnswerStatus | null;
  sendTime?: Date | null;
  debitingMoney?: Date | null;
  executionStatus?: ExecutionStatus | null;
  reasonError?: string | null;
  executionError?: string | null;
  handlerError?: string | null;
  client?: ClientInfoResponseDto | null;
  card?: CardInfoResponseDto | null;
  bonusOpers: BonusOperResponseDto[];
  device?: DeviceInfoResponseDto | null;
  pos?: PosInfoResponseDto | null;
}

export class LoyaltyProgramOrdersPaginatedResponseDto {
  orders: LoyaltyProgramOrderResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
