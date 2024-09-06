import { Injectable } from "@nestjs/common";
import { ICarWashDeviceRepository } from "@device/device/interfaces/device";
import { CarWashDevice } from "@device/device/domain/device";

@Injectable()
export class GetAllByPosCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
  ) {
  }

  async execute(posId: number): Promise<CarWashDevice[]> {
    const devices = await this.carWashDeviceRepository.findAllByCWId(posId);
    if (devices.length == 0) {
      return [];
    }
    return devices;
  }
}