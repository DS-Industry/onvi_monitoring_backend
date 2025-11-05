import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { DeviceType } from '@infra/pos/interface/pos.interface';

export interface DetermineOrderStatusRequest {
  sum: number;
  bayType?: DeviceType | null;
}

@Injectable()
export class OrderStatusDeterminationService {
  determineInitialStatus(
    request: DetermineOrderStatusRequest,
  ): OrderStatus {
    const isFreeVacuum =
      request.sum === 0 && request.bayType === DeviceType.VACUUME;

    return isFreeVacuum
      ? OrderStatus.FREE_PROCESSING
      : OrderStatus.CREATED;
  }

  isFreeVacuum(request: DetermineOrderStatusRequest): boolean {
    return request.sum === 0 && request.bayType === DeviceType.VACUUME;
  }
}


