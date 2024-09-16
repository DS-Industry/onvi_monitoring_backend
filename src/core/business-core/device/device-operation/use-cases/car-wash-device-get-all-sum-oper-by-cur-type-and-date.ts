import { Injectable } from '@nestjs/common';
import { PosGetSumByCutTypeAndDateDto } from '@device/device-operation/use-cases/dto/pos-get-sum-by-cut-type-and-date.dto';
import { DeviceOperationGetSumByCurTypeAndDateUseCase } from '@device/device-operation/use-cases/device-operation-get-sum-by-cur-type-and-date';
import { GetAllByPosCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-all-by-pos';

@Injectable()
export class GetAllSumOperByCurTypeAndDateCarWashDeviceUseCase {
  constructor(
    private readonly getAllByPosCarWashDeviceUseCase: GetAllByPosCarWashDeviceUseCase,
    private readonly getSumByCurTypeAndDateDeviceOperationUseCase: DeviceOperationGetSumByCurTypeAndDateUseCase,
  ) {}
  async execute(input: PosGetSumByCutTypeAndDateDto): Promise<number> {
    let sum = 0;
    const devices = await this.getAllByPosCarWashDeviceUseCase.execute(
      input.posId,
    );
    await Promise.all(
      devices.map(async (device) => {
        const newSum =
          await this.getSumByCurTypeAndDateDeviceOperationUseCase.execute({
            currencyType: input.currencyType,
            carWashDeviceId: device.id,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
          });
        sum = sum + newSum;
      }),
    );
    return sum;
  }
}
