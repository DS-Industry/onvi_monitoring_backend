import { Injectable } from '@nestjs/common';
import { GetByIdPosUseCase } from '@pos/pos/use-cases/pos-get-by-id';
import { PosMonitoringDto } from '@platform-user/pos/controller/dto/pos-monitoring';
import {
  PosProgramInfo,
  PosProgramResponseDto,
} from '@platform-user/pos/controller/dto/pos-program-response.dto';
import { PosResponseDto } from '@platform-user/pos/controller/dto/pos-response.dto';
import { GetAllPosUseCase } from '@pos/pos/use-cases/pos-get-all';
import { GetAllByPosIdAndDateDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-get-all-by-pos-id-and-date';
import { DataByPosIdDeviceProgramUseCase } from '@device/device-program/device-program/use-case/device-program-data-by-pos-id';
import { DeviceProgramGetLastProgByPosIdUseCase } from '@device/device-program/device-program/use-case/device-program-get-last-prog-by-pos-id';

@Injectable()
export class ProgramPosUseCase {
  constructor(
    private readonly getByIdPosUseCase: GetByIdPosUseCase,
    private readonly getAllPosUseCase: GetAllPosUseCase,
    private readonly getAllByPosIdAndDateDeviceProgramUseCase: GetAllByPosIdAndDateDeviceProgramUseCase,
    private readonly dataByPosIdDeviceProgramUseCase: DataByPosIdDeviceProgramUseCase,
    private readonly deviceProgramGetLastProgByPosIdUseCase: DeviceProgramGetLastProgByPosIdUseCase,
  ) {}

  async execute(input: PosMonitoringDto): Promise<PosProgramResponseDto[]> {
    const response: PosProgramResponseDto[] = [];
    let poses: PosResponseDto[] = [];
    if (input.posId) {
      poses.push(await this.getByIdPosUseCase.execute(input.posId));
    } else {
      poses = await this.getAllPosUseCase.execute();
    }

    await Promise.all(
      poses.map(async (pos) => {
        const devicePrograms =
          await this.getAllByPosIdAndDateDeviceProgramUseCase.execute({
            carWashPosId: pos.id,
            dateStart: input.dateStart,
            dateEnd: input.dateEnd,
          });
        const lastProg =
          await this.deviceProgramGetLastProgByPosIdUseCase.execute(pos.id);
        if (devicePrograms.length > 0) {
          const programs = await this.dataByPosIdDeviceProgramUseCase.execute(
            devicePrograms,
            lastProg,
          );
          response.push({
            id: pos.id,
            name: pos.name,
            programsInfo: programs,
          });
        }
      }),
    );

    return response;
  }
}
