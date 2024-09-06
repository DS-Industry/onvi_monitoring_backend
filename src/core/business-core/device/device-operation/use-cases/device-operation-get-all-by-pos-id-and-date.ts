import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { DeviceOperationGetAllByCutTypeAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-pos-id-and-date.dto';
import { DeviceOperation } from '@device/device-operation/domain/device-operation';

@Injectable()
export class DeviceOperationGetAllByPosIdAndDateUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(
    input: DeviceOperationGetAllByCutTypeAndDateDto,
  ): Promise<DeviceOperation[]> {
    return await this.deviceOperationRepository.findAllByPosIdAndDate(
      input.carWashPosId,
      input.dateStart,
      input.dateEnd,
    );
  }
}
