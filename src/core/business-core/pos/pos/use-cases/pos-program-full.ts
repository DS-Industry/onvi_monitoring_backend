import { Injectable } from '@nestjs/common';
import { PosProgramDto } from '@platform-user/core-controller/dto/response/pos-program-response.dto';
import { FindMethodsCarWashDeviceUseCase } from '@pos/device/device/use-cases/car-wash-device-find-methods';
import { FindMethodsDeviceProgramUseCase } from '@pos/device/device-data/device-data/device-program/device-program/use-case/device-program-find-methods';
import { Pos } from '@pos/pos/domain/pos';
import { FindMethodsCarWashPosUseCase } from '@pos/carWashPos/use-cases/car-wash-pos-find-methods';
import { CarWashPosType } from '@prisma/client';
import { DeviceProgramMonitoringResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-monitoring-response.dto';
import { DeviceProgramLastDataResponseDto } from '@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-last-data-response.dto';

@Injectable()
export class PosProgramFullUseCase {
  constructor(
    private readonly findMethodsCarWashPosUseCase: FindMethodsCarWashPosUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly findMethodsDeviceProgramUseCase: FindMethodsDeviceProgramUseCase,
  ) {}

  async execute(
    dateStart: Date,
    dateEnd: Date,
    pos: Pos,
  ): Promise<PosProgramDto[]> {
    const carWashPos = await this.findMethodsCarWashPosUseCase.getById(pos.id);
    const devices = await this.findMethodsCarWashDeviceUseCase.getAllByPos(
      pos.id,
    );
    const deviceIds = devices.map((device) => device.id);

    const [programsData, lastProgramsData] = await Promise.all([
      carWashPos.carWashPosType === CarWashPosType.Portal
        ? this.findMethodsDeviceProgramUseCase.getDataByMonitoringDetailPortal(
            deviceIds,
            dateStart,
            dateEnd,
          )
        : this.findMethodsDeviceProgramUseCase.getDataByMonitoringDetail(
            deviceIds,
            dateStart,
            dateEnd,
          ),
      this.findMethodsDeviceProgramUseCase.getLastByDeviceIds(deviceIds),
    ]);

    const programsByDevice = this.groupProgramsByDeviceId(programsData);
    const lastProgramsByDevice =
      this.groupLastProgramsByDevice(lastProgramsData);

    return devices.map((device) => {
      const devicePrograms = programsByDevice.get(device.id) || [];
      const lastPrograms = lastProgramsByDevice.get(device.id) || [];

      return {
        id: device.id,
        name: device.name,
        posType: carWashPos.carWashPosType,
        programsInfo: devicePrograms.map((program) => {
          const lastOper = lastPrograms.find(
            (p) => p.programName === program.programName,
          )?.operDate;

          return {
            programName: program.programName,
            counter: program.counter,
            totalTime: program.totalTime,
            averageTime: this.formatSecondsToTime(program.averageTime * 60),
            totalProfit: program.totalProfit || 0,
            averageProfit: program.averageProfit || 0,
            lastOper: lastOper,
          };
        }),
      };
    });
  }

  private groupProgramsByDeviceId(
    programs: DeviceProgramMonitoringResponseDto[],
  ): Map<number, DeviceProgramMonitoringResponseDto[]> {
    return programs.reduce((map, program) => {
      const deviceId = program.ownerId;
      if (!map.has(deviceId)) {
        map.set(deviceId, []);
      }
      map.get(deviceId)!.push(program);
      return map;
    }, new Map<number, DeviceProgramMonitoringResponseDto[]>());
  }

  private groupLastProgramsByDevice(
    lastPrograms: DeviceProgramLastDataResponseDto[],
  ): Map<number, DeviceProgramLastDataResponseDto[]> {
    return lastPrograms.reduce((map, program) => {
      const deviceId = program.ownerId;
      if (!map.has(deviceId)) {
        map.set(deviceId, []);
      }
      map.get(deviceId)!.push(program);
      return map;
    }, new Map<number, DeviceProgramLastDataResponseDto[]>());
  }

  private formatSecondsToTime(seconds: number): string {
    const days = Math.trunc(seconds / 86400);
    const hours = Math.trunc((seconds % 86400) / 3600);
    const minutes = Math.trunc((seconds % 3600) / 60);
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
