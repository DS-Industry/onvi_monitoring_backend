import { Injectable } from '@nestjs/common';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';
import { CheckCarDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-check-car';
import { DeviceProgramResponseDto } from '@platform-user/core-controller/dto/response/device-program-response.dto';
import { PROGRAM_TIME_CHECK_AUTO, PROGRAM_TYPE_ID_CHECK_AUTO } from "@constant/constants";

@Injectable()
export class DataByDeviceProgramUseCase {
  constructor(
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
    private readonly findMethodsDeviceProgramTypeUseCase: FindMethodsDeviceProgramTypeUseCase,
    private readonly checkCarDeviceProgramUseCase: CheckCarDeviceProgramUseCase,
  ) {}

  async execute(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgramResponseDto[]> {
    const response: DeviceProgramResponseDto[] = [];
    const devicePrograms =
      await this.findMethodsDeviceProgramUseCase.getAllByDeviceIdAndDateProgram(
        deviceId,
        dateStart,
        dateEnd,
      );

    const payTypeMapping = {
      1: 'Наличные',
      2: 'Карта',
      3: 'Карта (наличные)',
      0: 'Уборка',
    };

    // Хранение последнего времени программы с типом PROGRAM_TYPE_ID_CHECK_AUTO
    let lastCheckAutoTime: Date | null = null;

    for (let i = 0; i < devicePrograms.length; i++) {
      const deviceProgram = devicePrograms[i];

      // Определяем тип оплаты
      const payType =
        payTypeMapping[deviceProgram.isPaid] || 'Неизвестный тип оплаты';

      // Проверяем, является ли программа проверкой автомобиля
      let isCarCheck = 0;
      if (
        deviceProgram.carWashDeviceProgramsTypeId === PROGRAM_TYPE_ID_CHECK_AUTO
      ) {
        if (
          lastCheckAutoTime === null ||
          (deviceProgram.beginDate.getTime() - lastCheckAutoTime.getTime()) /
            (1000 * 60) >
            PROGRAM_TIME_CHECK_AUTO
        ) {
          isCarCheck = 1;
        }
        lastCheckAutoTime = deviceProgram.beginDate; // Обновляем время последней проверки авто
      }

      // Формируем ответ
      response.push({
        id: deviceProgram.id,
        name: deviceProgram.programName,
        dateBegin: deviceProgram.beginDate,
        dateEnd: deviceProgram.endDate,
        time: this.formatSecondsToTime(
          deviceProgram.endDate,
          deviceProgram.beginDate,
        ),
        localId: deviceProgram.localId,
        payType: payType,
        isCar: isCarCheck,
      });
    }

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

    return result.trim();
  }
}
