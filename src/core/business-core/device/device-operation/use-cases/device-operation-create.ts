import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { DeviceOperationCreateDto } from '@device/device-operation/use-cases/dto/device-operation-create.dto';
import { DeviceOperation } from '@device/device-operation/domain/device-operation';

@Injectable()
export class CreateDeviceOperationUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(input: DeviceOperationCreateDto): Promise<void> {
    const deviceOperationData = new DeviceOperation({
      carWashDeviceId: input?.carWashDeviceId,
      operDate: input.operDate,
      loadDate: input.loadDate,
      counter: input.counter,
      operSum: input.operSum,
      confirm: input.confirm,
      isAgregate: input.isAgregate,
      localId: input.localId,
      currencyId: input.currencyId,
      isBoxOffice: input.isBoxOffice,
      errNumId: input?.errNumId,
    });

    await this.deviceOperationRepository.create(deviceOperationData);
  }
}
