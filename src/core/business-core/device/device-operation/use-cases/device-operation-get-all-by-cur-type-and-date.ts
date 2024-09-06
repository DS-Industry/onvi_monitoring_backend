import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { DeviceOperationGetAllByCutTypeAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-cut-type-and-date.dto';
import { DeviceOperation } from '@device/device-operation/domain/device-operation';

@Injectable()
export class DeviceOperationGetAllByCurTypeAndDateUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(
    input: DeviceOperationGetAllByCutTypeAndDateDto,
  ): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByCurTypeAndDate(
      input.currencyType,
      input.carWashDeviceId,
      input.dateStart,
      input.dateEnd,
    );
  }
}
