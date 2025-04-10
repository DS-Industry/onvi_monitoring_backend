import { ExecutionStatus, OrderHandlerStatus, OrderStatus, SendAnswerStatus } from "@prisma/client";

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