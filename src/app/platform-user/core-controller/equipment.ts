import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { FindMethodsEquipmentKnotUseCase } from '@equipment/equipmentKnot/use-cases/equipment-knot-find-methods';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  ReadPosAbility,
  UpdatePosAbility,
} from '@common/decorators/abilities.decorator';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { FullInfoByEquipmentKnotIncidentUseCase } from '@equipment/incident/incidentName/use-cases/incident-full-info-by-equipment-knot';
import { FindMethodsDeviceProgramTypeUseCase } from '@pos/device/device-data/device-data/device-program/device-program-type/use-case/device-program-type-find-methods';
import { GetAllByPosIdProgramTechRateUseCase } from '@tech-task/programTechRate/use-cases/programTechRate-get-all-by-pos-id';
import { UpdateProgramTechRateUseCase } from '@tech-task/programTechRate/use-cases/programTechRate-update';
import { EquipmentTechRateUpdateDto } from '@platform-user/core-controller/dto/receive/equipment-tech-rate-update.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly findMethodsEquipmentKnotUseCase: FindMethodsEquipmentKnotUseCase,
    private readonly fullInfoByEquipmentKnotIncidentUseCase: FullInfoByEquipmentKnotIncidentUseCase,
    private readonly findMethodsDeviceProgramTypeUseCase: FindMethodsDeviceProgramTypeUseCase,
    private readonly getAllByPosIdProgramTechRateUseCase: GetAllByPosIdProgramTechRateUseCase,
    private readonly updateProgramTechRateUseCase: UpdateProgramTechRateUseCase,
    private readonly posValidateRules: PosValidateRules,
  ) {}
  //Get all knot by Pos
  @Get('pos/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getAllByPosId(
    @Request() req: any,
    @Param('posId', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(id, ability);
      return await this.findMethodsEquipmentKnotUseCase.getAllByPosId(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('incident-info/:id')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAllIncidentInfo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      return await this.fullInfoByEquipmentKnotIncidentUseCase.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('rate/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getProgramRate(
    @Request() req: any,
    @Param('posId', ParseIntPipe) id: number,
  ): Promise<any> {
    const { ability } = req;
    await this.posValidateRules.getOneByIdValidate(id, ability);
    const programTypes =
      await this.findMethodsDeviceProgramTypeUseCase.getAllByPosId(id);
    return await this.getAllByPosIdProgramTechRateUseCase.execute(
      programTypes,
      id,
    );
  }

  @Patch('rate/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdatePosAbility())
  @HttpCode(200)
  async patchProgramRate(
    @Request() req: any,
    @Param('posId', ParseIntPipe) id: number,
    @Body() data: EquipmentTechRateUpdateDto,
  ): Promise<any> {
    const { ability } = req;
    const programTechRateIds = data.valueData.map(
      (item) => item.programTechRateId,
    );
    await this.posValidateRules.patchProgramRateValidate(
      id,
      programTechRateIds,
      ability,
    );
    return await this.updateProgramTechRateUseCase.execute(data.valueData);
  }
}
