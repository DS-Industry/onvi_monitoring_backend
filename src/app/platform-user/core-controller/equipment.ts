import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { FindMethodsEquipmentKnotUseCase } from '@equipment/equipmentKnot/use-cases/equipment-knot-find-methods';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  ReadPosAbility,
} from '@common/decorators/abilities.decorator';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { FullInfoByEquipmentKnotIncidentUseCase } from '@equipment/incident/incidentName/use-cases/incident-full-info-by-equipment-knot';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly findMethodsEquipmentKnotUseCase: FindMethodsEquipmentKnotUseCase,
    private readonly fullInfoByEquipmentKnotIncidentUseCase: FullInfoByEquipmentKnotIncidentUseCase,
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
}
