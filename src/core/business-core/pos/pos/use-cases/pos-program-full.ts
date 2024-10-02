import { Injectable } from '@nestjs/common';
import { DataByPosIdDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-data-by-pos-id';
import { PosProgramResponseDto } from '@platform-user/pos/controller/dto/pos-program-response.dto';
import { GetAllByDeviceIdAndDateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-get-all-by-device-id-and-date';
import { DeviceProgramGetLastProgByDeviceIdUseCase } from '@device/device-program/device-program/use-case/device-program-get-last-prog-by-device-id';
import { PosMonitoringFullDto } from "@pos/pos/use-cases/dto/pos-monitoring-full.dto";
import { FindMethodsPosUseCase } from "@pos/pos/use-cases/pos-find-methods";
import { FindMethodsCarWashDeviceUseCase } from "@pos/device/device/use-cases/car-wash-device-find-methods";

@Injectable()
export class PosProgramFullUseCase {
  constructor(
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly findMethodsCarWashDeviceUseCase: FindMethodsCarWashDeviceUseCase,
    private readonly getAllByDeviceIdAndDateDeviceProgramUseCase: GetAllByDeviceIdAndDateDeviceProgramUseCase,
    private readonly dataByPosIdDeviceProgramUseCase: DataByPosIdDeviceProgramUseCase,
    private readonly deviceProgramGetLastProgByDeviceIdUseCase: DeviceProgramGetLastProgByDeviceIdUseCase,
  ) {}

  async execute(input: PosMonitoringFullDto): Promise<PosProgramResponseDto[]> {
    const response: PosProgramResponseDto[] = [];
    const pos = await this.findMethodsPosUseCase.getById(input.posId);
    const devices = await this.findMethodsCarWashDeviceUseCase.getAllByPos(pos.id);

    await Promise.all(
      devices.map(async (device) => {
        const devicePrograms =
          await this.getAllByDeviceIdAndDateDeviceProgramUseCase.execute({
            deviceId: device.id,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
          });
        const lastProg =
          await this.deviceProgramGetLastProgByDeviceIdUseCase.execute(
            device.id,
          );
        if (devicePrograms.length > 0) {
          const programs = await this.dataByPosIdDeviceProgramUseCase.execute(
            devicePrograms,
            lastProg,
          );
          response.push({
            id: device.id,
            name: device.name,
            programsInfo: programs,
          });
        }
      }),
    );

    return response;
  }
}
