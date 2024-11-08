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
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateTechTaskAbility,
  ReadTechTaskAbility,
  UpdateTechTaskAbility,
} from '@common/decorators/abilities.decorator';
import { TechTaskCreateDto } from '@platform-user/core-controller/dto/receive/tech-task-create.dto';
import { TechTaskValidateRules } from '@platform-user/validate/validate-rules/techTask-rules';
import { TechTaskUpdateDto } from '@platform-user/core-controller/dto/receive/tech-task-update.dto';
import { UpdateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-update';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { ManageAllByPosAndStatusesTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-manage-all-by-pos-and-statuses';
import { StatusTechTask } from '@prisma/client';
import { ShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-shape';
import { TechTaskCompletionShapeDto } from '@platform-user/core-controller/dto/receive/tech-task-completion-shape.dto';
import { CompletionShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-completion-shape';

@Controller('tech-task')
export class TechTaskController {
  constructor(
    private readonly createTechTaskUseCase: CreateTechTaskUseCase,
    private readonly techTaskValidateRules: TechTaskValidateRules,
    private readonly updateTechTaskUseCase: UpdateTechTaskUseCase,
    private readonly manageAllByPosAndStatusesTechTaskUseCase: ManageAllByPosAndStatusesTechTaskUseCase,
    private readonly shapeTechTaskUseCase: ShapeTechTaskUseCase,
    private readonly completionShapeTechTaskUseCase: CompletionShapeTechTaskUseCase,
    private readonly posValidateRules: PosValidateRules,
  ) {}
  //Create techTask
  @Post()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateTechTaskAbility())
  @HttpCode(201)
  async create(
    @Body() data: TechTaskCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      await this.techTaskValidateRules.createValidate(
        data.posId,
        data.techTaskItem,
        ability,
      );
      return await this.createTechTaskUseCase.execute(data, user.id);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Patch techTask
  @Patch()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateTechTaskAbility())
  @HttpCode(201)
  async update(
    @Body() data: TechTaskUpdateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user, ability } = req;
      const techTask = await this.techTaskValidateRules.updateValidate(
        data.techTaskId,
        ability,
        data?.techTaskItem,
      );
      return await this.updateTechTaskUseCase.execute(data, techTask, user);
    } catch (e) {
      throw new Error(e);
    }
  }
  //Get all techTask for manage by id
  @Get('manage/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateTechTaskAbility())
  @HttpCode(200)
  async getAllForManage(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
  ) {
    const { ability } = req;
    await this.posValidateRules.getOneByIdValidate(posId, ability);
    return await this.manageAllByPosAndStatusesTechTaskUseCase.execute(posId, [
      StatusTechTask.ACTIVE,
      StatusTechTask.PAUSE,
    ]);
  }
  //Get all techTask for manage by id
  @Get('read/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async getAllForRead(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
  ) {
    const { ability } = req;
    await this.posValidateRules.getOneByIdValidate(posId, ability);
    return await this.manageAllByPosAndStatusesTechTaskUseCase.execute(posId, [
      StatusTechTask.ACTIVE,
      StatusTechTask.OVERDUE,
    ]);
  }
  //Get shape techTask by id
  @Get(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async getShapeById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    const { ability } = req;
    const techTask = await this.techTaskValidateRules.getShapeByIdValidate(
      id,
      ability,
    );
    return await this.shapeTechTaskUseCase.execute(techTask);
  }
  //Completion shape techTask by id
  @Post(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async completionShapeById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: TechTaskCompletionShapeDto,
  ): Promise<any> {
    const { ability, user } = req;
    const itemIds = data.valueData.map((item) => item.itemValueId);
    const techTask =
      await this.techTaskValidateRules.completionShapeByIdValidate(
        id,
        itemIds,
        ability,
      );
    return await this.completionShapeTechTaskUseCase.execute(
      techTask,
      data.valueData,
      user,
    );
  }
}
