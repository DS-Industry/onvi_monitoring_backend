import { Injectable } from '@nestjs/common';
import { IPosService, DeviceType } from '@infra/pos/interface/pos.interface';
import {
  BayBusyException,
  CarWashUnavailableException,
} from '../exceptions';

export interface ValidatePosStatusRequest {
  posId: number;
  carWashDeviceId: number;
  bayType?: DeviceType | null;
}

@Injectable()
export class OrderValidationService {
  constructor(private readonly posService: IPosService) {}

  async validatePosStatus(request: ValidatePosStatusRequest): Promise<void> {
    const ping = await this.posService.ping({
      posId: request.posId,
      carWashDeviceId: request.carWashDeviceId,
      type: request.bayType ?? null,
    });

    if (ping.status === 'Busy') {
      throw new BayBusyException(request.carWashDeviceId);
    }

    if (ping.status === 'Unavailable') {
      throw new CarWashUnavailableException(request.posId);
    }
  }
}

