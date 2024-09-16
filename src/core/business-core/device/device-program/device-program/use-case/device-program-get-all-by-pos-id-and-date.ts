import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { DeviceOperationGetAllByCutTypeAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-pos-id-and-date.dto';
import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';

@Injectable()
export class GetAllByPosIdAndDateDeviceProgramUseCase {
  constructor(
    private readonly deviceProgramRepository: IDeviceProgramRepository,
  ) {}

  async execute(
    input: DeviceOperationGetAllByCutTypeAndDateDto,
  ): Promise<DeviceProgram[]> {
    return await this.deviceProgramRepository.findAllByPosIdAndDate(
      input.carWashPosId,
      input.dateStart,
      input.dateEnd,
    );
  }
}
