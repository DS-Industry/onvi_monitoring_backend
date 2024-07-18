import { Injectable } from '@nestjs/common';
import { ICarWashDeviceRepository } from '@device/device/interfaces/device';
import { CarWashDeviceCreateDto } from '@platform-user/device/controller/dto/car-wash-device-create.dto';
import { CarWashDeviceFullDataResponseDto } from '@platform-user/device/controller/dto/car-wash-device-full-data-response.dto';
import { GetByIdCarWashDeviceTypeUseCase } from '@device/deviceType/use-cases/car-wash-device-type-get-by-id';
import { CarWashDevice } from '@device/device/domain/device';
import { GetFullDataCarWashDeviceUseCase } from '@device/device/use-cases/car-wash-device-get-full-data';

@Injectable()
export class CreateCarWashDeviceUseCase {
  constructor(
    private readonly carWashDeviceRepository: ICarWashDeviceRepository,
    private readonly carWashDeviceTypeGetByIdUseCase: GetByIdCarWashDeviceTypeUseCase,
    private readonly carWashDeviceGetFullDateUseCase: GetFullDataCarWashDeviceUseCase,
  ) {}

  async execute(
    input: CarWashDeviceCreateDto,
  ): Promise<CarWashDeviceFullDataResponseDto> {
    const carWashDeviceType =
      await this.carWashDeviceTypeGetByIdUseCase.execute(
        input.carWashDeviceTypeId,
      );
    const carWashDeviceCheck =
      await this.carWashDeviceRepository.findOneByNameAndCWId(
        input.carWashPosId,
        input.name,
      );
    if (carWashDeviceCheck) {
      throw new Error('carWashDeviceCheck exists');
    }

    const carWashDeviceData = new CarWashDevice({
      name: input.name,
      carWashDeviceMetaData: input.carWashDeviceMetaData,
      status: input.status,
      ipAddress: input.ipAddress,
      carWashDeviceTypeId: carWashDeviceType.id,
      carWashPosId: input.carWashPosId,
    });

    const carWashDevice =
      await this.carWashDeviceRepository.create(carWashDeviceData);
    return this.carWashDeviceGetFullDateUseCase.execute(carWashDevice);
  }
}
