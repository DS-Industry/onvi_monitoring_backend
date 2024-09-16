import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { DeviceOperationGetAllByCutTypeAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-cut-type-and-date.dto';

@Injectable()
export class DeviceOperationGetSumByCurTypeAndDateUseCase {
  constructor(
    private readonly deviceOperationRepository: IDeviceOperationRepository,
  ) {}

  async execute(
    input: DeviceOperationGetAllByCutTypeAndDateDto,
  ): Promise<number> {
    let sum = 0;
    const deviceOperations =
      await this.deviceOperationRepository.findAllByCurTypeAndDate(
        input.currencyType,
        input.carWashDeviceId,
        input.dateStart,
        input.dateEnd,
      );

    await Promise.all(
      deviceOperations.map(async (oper) => (sum = sum + oper.operSum)),
    );

    return sum;
  }
}
