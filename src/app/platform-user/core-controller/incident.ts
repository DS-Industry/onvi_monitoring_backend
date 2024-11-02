import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-create';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateIncidentAbility,
  ReadIncidentAbility,
  UpdateIncidentAbility,
} from '@common/decorators/abilities.decorator';
import { IncidentValidateRules } from '@platform-user/validate/validate-rules/incident-validate-rules';
import { IncidentCreateDto } from '@platform-user/core-controller/dto/receive/incident-create.dto';
import { UpdateIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-update';
import { IncidentUpdateDto } from '@platform-user/core-controller/dto/receive/incident-update.dto';
import { PosMonitoringDto } from '@platform-user/core-controller/dto/receive/pos-monitoring';
import { GetAllByFilterIncidentUseCase } from '@equipment/incident/incident/use-cases/incident-get-all-by-filter';

@Controller('incident')
export class IncidentController {
  constructor(
    private readonly createIncidentUseCase: CreateIncidentUseCase,
    private readonly updateIncidentUseCase: UpdateIncidentUseCase,
    private readonly getAllByFilterIncidentUseCase: GetAllByFilterIncidentUseCase,
    private readonly incidentValidateRules: IncidentValidateRules,
  ) {}
  //Create incident
  @Post()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateIncidentAbility())
  @HttpCode(201)
  async create(
    @Body() data: IncidentCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      await this.incidentValidateRules.createValidate({
        posId: data.posId,
        workerId: data.workerId,
        equipmentKnotId: data?.equipmentKnotId,
        incidentNameId: data?.incidentNameId,
        incidentReasonId: data?.incidentReasonId,
        incidentSolutionId: data?.incidentSolutionId,
        carWashDeviceProgramsTypeId: data?.carWashDeviceProgramsTypeId,
        ability: ability,
      });
      return await this.createIncidentUseCase.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Update incident
  @Patch()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateIncidentAbility())
  @HttpCode(201)
  async update(
    @Body() data: IncidentUpdateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const oldIncident = await this.incidentValidateRules.updateValidate({
        incidentId: data.incidentId,
        workerId: data?.workerId,
        equipmentKnotId: data?.equipmentKnotId,
        incidentNameId: data?.incidentNameId,
        incidentReasonId: data?.incidentReasonId,
        incidentSolutionId: data?.incidentSolutionId,
        carWashDeviceProgramsTypeId: data?.carWashDeviceProgramsTypeId,
        ability: ability,
      });
      return await this.updateIncidentUseCase.execute(data, oldIncident, user);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all incident by filter
  @Get()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadIncidentAbility())
  @HttpCode(200)
  async getAllIncidentByFilter(
    @Request() req: any,
    @Query() params: PosMonitoringDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      if (params.posId) {
        await this.incidentValidateRules.getAllIncidentByFilterValidate(
          params.posId,
          ability,
        );
      }
      return await this.getAllByFilterIncidentUseCase.execute(
        params.dateStart,
        params.dateEnd,
        params.posId,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
