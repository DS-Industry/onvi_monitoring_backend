import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceEventUseCase } from '@pos/device/device-data/device-data/device-event/device-event/use-case/device-event-find-methods';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FinanceGetTimeStampResponseDto } from '@platform-user/core-controller/dto/response/finance-get-time-stamp-response.dto';
import { EVENT_TYPE_CASH_COLLECTION_ID } from '@constant/constants';

@Injectable()
export class GetAllTimeStampDeviceEventUseCase {
  constructor(
    private readonly findMethodsDeviceEventUseCase: FindMethodsDeviceEventUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
  ) {}

  async execute(posId: number): Promise<FinanceGetTimeStampResponseDto[]> {
    const devices =
      await this.findMethodsCarWashDeviceUseCase.getAllByPos(posId);
    const response: FinanceGetTimeStampResponseDto[] = [];

    for (const device of devices) {
      const lastDeviceEvent =
        await this.findMethodsDeviceEventUseCase.getLastEventByDeviceIdAndTypeId(
          device.id,
          EVENT_TYPE_CASH_COLLECTION_ID,
        );
      response.push({
        deviceId: device.id,
        deviceName: device.name,
        oldTookMoneyTime: lastDeviceEvent?.eventDate || null,
      });
    }

    return response;
  }
}
