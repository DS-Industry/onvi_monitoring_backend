import {
  ExecutionStatus,
  OrderHandlerStatus,
  OrderStatus,
  SendAnswerStatus,
} from '@loyalty/order/domain/enums';

export class UpdateDto {
  orderStatus?: OrderStatus;
  sendAnswerStatus?: SendAnswerStatus;
  sendTime?: Date;
  executionStatus?: ExecutionStatus;
  reasonError?: string;
  executionError?: string;
  orderHandlerStatus?: OrderHandlerStatus;
  handlerError?: string;
}
