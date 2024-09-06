import { Injectable } from '@nestjs/common';
import { DeviceOperationGetAllByDeviceIdAndDateDto } from '@device/device-operation/use-cases/dto/device-operation-get-all-by-device-id-and-date.dto';
import { DeviceProgramResponseDto } from '@platform-user/device/controller/dto/device-program-response.dto';
import { GetAllByDeviceIdAndDateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-get-all-by-device-id-and-date';
import { GetByIdDeviceProgramTypeUseCase } from '@device/device-program/device-program-type/use-case/device-program-type-get-by-id';
import { CheckCarDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-check-car';

@Injectable()
export class ProgramDeviceUseCase {
  constructor(
    private readonly getAllByDeviceIdAndDateDeviceProgramUseCase: GetAllByDeviceIdAndDateDeviceProgramUseCase,
    private readonly getByIdDeviceProgramTypeUseCase: GetByIdDeviceProgramTypeUseCase,
    private readonly checkCarDeviceProgramUseCase: CheckCarDeviceProgramUseCase,
  ) {}

  async execute(
    input: DeviceOperationGetAllByDeviceIdAndDateDto,
  ): Promise<DeviceProgramResponseDto[]> {
    const response: DeviceProgramResponseDto[] = [];
    const devicePrograms =
      await this.getAllByDeviceIdAndDateDeviceProgramUseCase.execute({
        deviceId: input.deviceId,
        dateStart: input.dateStart,
        dateEnd: input.dateEnd,
      });

    await Promise.all(
      devicePrograms.map(async (deviceProgram) => {
        const programType = await this.getByIdDeviceProgramTypeUseCase.execute(
          deviceProgram.carWashDeviceProgramsTypeId,
        );
        const payTypeMapping = {
          1: 'Наличные',
          2: 'Карта',
          3: 'Карта (наличные)',
          0: 'Уборка',
        };
        let payType = payTypeMapping[deviceProgram.isPaid];
        if (!payType) {
          payType = 'Неизвестный тип оплаты';
        }
        const isCarCheck = await this.checkCarDeviceProgramUseCase.execute({
          deviceId: deviceProgram.carWashDeviceId,
          dateProgram: deviceProgram.beginDate,
          programTypeId: deviceProgram.carWashDeviceProgramsTypeId,
        });

        response.push({
          id: deviceProgram.id,
          name: programType.name,
          dateBegin: deviceProgram.beginDate,
          dateEnd: deviceProgram.endDate,
          time: this.formatSecondsToTime(
            deviceProgram.endDate,
            deviceProgram.beginDate,
          ),
          localId: deviceProgram.localId,
          payType: payType,
          isCar: isCarCheck ? 1 : 0,
        });
      }),
    );

    return response;
  }

  private formatSecondsToTime(endDate: Date, beginDate: Date): string {
    const seconds = Math.trunc(
      (endDate.getTime() - beginDate.getTime()) / 1000,
    );

    const days = Math.trunc(seconds / 86400); // 86400 секунд в сутках
    const hours = Math.trunc((seconds % 86400) / 3600); // 3600 секунд в часе
    const minutes = Math.trunc((seconds % 3600) / 60); // 60 секунд в минуте
    const remainingSeconds = Math.trunc(seconds % 60);

    let result = '';

    if (days === 1) {
      result += `${days} день `;
    } else if (days > 1) {
      result += `${days} дней `;
    }

    if (hours === 1) {
      result += `${hours} час `;
    } else if (hours > 1) {
      result += `${hours} часа `;
    }

    if (minutes > 0) {
      result += `${minutes} мин. `;
    }

    if (remainingSeconds > 0) {
      result += `${remainingSeconds} сек.`;
    }

    return result.trim(); // Удаляем лишние пробелы
  }
}
