import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-create';
import { DeleteTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-delete';
import { DeleteManyTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-delete-many';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateTechTaskAbility,
  DeleteTechTaskAbility,
  ReadIncidentAbility,
  ReadTechTaskAbility,
  UpdateTechTaskAbility,
} from '@common/decorators/abilities.decorator';
import { TechTaskCreateDto } from '@platform-user/core-controller/dto/receive/tech-task-create.dto';
import { TechTaskValidateRules } from '@platform-user/validate/validate-rules/techTask-rules';
import { TechTaskUpdateDto } from '@platform-user/core-controller/dto/receive/tech-task-update.dto';
import { UpdateTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-update';
import { PosValidateRules } from '@platform-user/validate/validate-rules/pos-validate-rules';
import { ManageAllByPosAndStatusesTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-manage-all-by-pos-and-statuses';
import { ShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-shape';
import { TechTaskCompletionShapeDto, itemValueDto } from '@platform-user/core-controller/dto/receive/tech-task-completion-shape.dto';
import { CompletionShapeTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-completion-shape';
import { GeneratingReportProgramTechRate } from '@tech-task/programTechRate/use-cases/programTechRate-generating-report';
import { PosChemistryProductionUseCase } from '@pos/pos/use-cases/pos-chemistry-production';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { ReadAllByPosTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-read-all-by-pos';
import { PosException, TechTaskException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { TechTaskManageInfoResponseDto } from '@tech-task/techTask/use-cases/dto/techTask-manage-info-response.dto';
import { TechTaskReadAllResponseDto } from '@tech-task/techTask/use-cases/dto/techTask-read-response.dto';
import { TechTaskShapeResponseDto } from '@tech-task/techTask/use-cases/dto/techTask-shape-response.dto';
import { CreateTechTagUseCase } from '@tech-task/tag/use-case/techTag-create';
import { FindMethodsTechTagUseCase } from '@tech-task/tag/use-case/techTag-find-methods';
import { TechTagCreateDto } from '@platform-user/core-controller/dto/receive/techTag-create.dto';
import { PosChemistryProductionResponseDto } from '@pos/pos/use-cases/dto/pos-chemistry-production-response.dto';
import { TechTaskPosFilterDto } from '@platform-user/core-controller/dto/receive/tech-task-pos-filter.dto';
import { TechTaskChemistryReportDto } from '@platform-user/core-controller/dto/receive/tech-task-chemistry-report.dto';
import { TechTaskResponseDto } from '@platform-user/core-controller/dto/response/techTask-response.dto';
import { TechTaskReportDto } from '@platform-user/core-controller/dto/receive/tech-task-report.dto';
import { ReportTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-report';
import { TechTaskItemTemplate } from '@tech-task/itemTemplate/domain/itemTemplate';
import { TechTag } from '@tech-task/tag/domain/techTag';
import { TechTask } from '@tech-task/techTask/domain/techTask';
import { TechTaskMeFilterDto } from '@platform-user/core-controller/dto/receive/tech-task-me-filter.dto';
import { TechTaskDeleteManyDto } from '@platform-user/core-controller/dto/receive/tech-task-delete-many.dto';
import { CreateTechTaskCommentUseCase } from '@tech-task/comment/use-cases/techTaskComment-create';
import { ReadTechTaskCommentsUseCase } from '@tech-task/comment/use-cases/techTaskComment-read';
import { TechTaskCommentCreateDto } from '@platform-user/core-controller/dto/receive/tech-task-comment-create.dto';
import { TechTaskCommentResponseDto } from '@platform-user/core-controller/dto/response/tech-task-comment-response.dto';

@Controller('tech-task')
export class TechTaskController {
  constructor(
    private readonly createTechTaskUseCase: CreateTechTaskUseCase,
    private readonly deleteTechTaskUseCase: DeleteTechTaskUseCase,
    private readonly deleteManyTechTaskUseCase: DeleteManyTechTaskUseCase,
    private readonly techTaskValidateRules: TechTaskValidateRules,
    private readonly updateTechTaskUseCase: UpdateTechTaskUseCase,
    private readonly manageAllByPosAndStatusesTechTaskUseCase: ManageAllByPosAndStatusesTechTaskUseCase,
    private readonly readAllByPosTechTaskUseCase: ReadAllByPosTechTaskUseCase,
    private readonly shapeTechTaskUseCase: ShapeTechTaskUseCase,
    private readonly generatingReportProgramTechRate: GeneratingReportProgramTechRate,
    private readonly posChemistryProductionUseCase: PosChemistryProductionUseCase,
    private readonly completionShapeTechTaskUseCase: CompletionShapeTechTaskUseCase,
    private readonly findMethodsItemTemplateUseCase: FindMethodsItemTemplateUseCase,
    private readonly reportTechTaskUseCase: ReportTechTaskUseCase,
    private readonly createTechTagUseCase: CreateTechTagUseCase,
    private readonly findMethodsTechTagUseCase: FindMethodsTechTagUseCase,
    private readonly posValidateRules: PosValidateRules,
    private readonly createTechTaskCommentUseCase: CreateTechTaskCommentUseCase,
    private readonly readTechTaskCommentsUseCase: ReadTechTaskCommentsUseCase,
  ) {}
  @Post()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateTechTaskAbility())
  @HttpCode(201)
  async create(
    @Body() data: TechTaskCreateDto,
    @Request() req: any,
  ): Promise<TechTaskResponseDto> {
    try {
      const { user, ability } = req;
      await this.techTaskValidateRules.createValidate(
        data.posId,
        data.techTaskItem,
        ability,
      );
      return await this.createTechTaskUseCase.execute(data, user.id);
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Patch()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateTechTaskAbility())
  @HttpCode(201)
  async update(
    @Body() data: TechTaskUpdateDto,
    @Request() req: any,
  ): Promise<TechTaskResponseDto> {
    try {
      const { user, ability } = req;
      const techTask = await this.techTaskValidateRules.updateValidate(
        data.techTaskId,
        ability,
        data?.techTaskItem,
      );
      return await this.updateTechTaskUseCase.execute(data, techTask, user);
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new DeleteTechTaskAbility())
  @HttpCode(200)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ status: string }> {
    try {
      const { ability } = req;
      const techTask = await this.techTaskValidateRules.deleteValidate(
        id,
        ability,
      );
      await this.deleteTechTaskUseCase.execute(techTask);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Delete('bulk/delete')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new DeleteTechTaskAbility())
  @HttpCode(200)
  async deleteMany(
    @Body() data: TechTaskDeleteManyDto,
    @Request() req: any,
  ): Promise<{ status: string }> {
    try {
      const { ability } = req;
      const techTasks = await this.techTaskValidateRules.deleteManyValidate(
        data.ids,
        ability,
        data.posId,
        data.organizationId,
      );
      await this.deleteManyTechTaskUseCase.execute(techTasks);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get('manage')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateTechTaskAbility())
  @HttpCode(200)
  async getAllForManagePatterns(
    @Request() req: any,
    @Query() params: TechTaskPosFilterDto,
  ): Promise<TechTaskManageInfoResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { user } = req;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }

      return await this.manageAllByPosAndStatusesTechTaskUseCase.execute(
        user,
        params.posId,
        skip,
        take,
      );
    } catch (e) {
      if (e instanceof PosException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('me')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async getAllForExecution(
    @Request() req: any,
    @Query() params: TechTaskMeFilterDto,
  ): Promise<TechTaskReadAllResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { user } = req;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }

      return await this.readAllByPosTechTaskUseCase.execute(
        user,
        { 
          posId: params.posId, 
          status: params.status, 
          organizationId: params.organizationId,
          name: params.name,
          tags: params.tags,
          startDate: params.startDate ? new Date(params.startDate) : undefined,
          endDate: params.endDate ? new Date(params.endDate) : undefined,
          authorId: params.authorId,
          executorId: params.executorId,
        },
        skip,
        take,
      );
    } catch (e) {
      if (e instanceof PosException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('report')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateTechTaskAbility())
  @HttpCode(200)
  async getAllForRead(
    @Request() req: any,
    @Query() params: TechTaskReportDto,
  ): Promise<TechTaskReadAllResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      const { user } = req;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }

      return await this.reportTechTaskUseCase.execute(
        user,
        {
          posId: params.posId,
          organizationId: params.organizationId,
          type: params.type,
          name: params.name,
          executorId: params.executorId,
          tags: params.tags,
          startDate: params.startDate ? new Date(params.startDate) : undefined,
          endDate: params.endDate ? new Date(params.endDate) : undefined,
        },
        skip,
        take,
      );
    } catch (e) {
      if (e instanceof PosException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('item')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAllItems(): Promise<TechTaskItemTemplate[]> {
    try {
      return await this.findMethodsItemTemplateUseCase.getAll();
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('chemistry-report')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadIncidentAbility())
  @HttpCode(200)
  async chemistryReport(
    @Request() req: any,
    @Query() data: TechTaskChemistryReportDto,
  ): Promise<PosChemistryProductionResponseDto[]> {
    try {
      const { ability } = req;
      const pos = await this.posValidateRules.getOneByIdValidate(
        data.posId,
        ability,
      );

      const techRateInfo = await this.generatingReportProgramTechRate.execute(
        pos.id,
        data.dateStart,
        data.dateEnd,
      );
      return await this.posChemistryProductionUseCase.execute(techRateInfo);
    } catch (e) {
      if (e instanceof PosException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Post('tag')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async createTechTag(@Body() data: TechTagCreateDto): Promise<TechTag> {
    try {
      await this.techTaskValidateRules.createTechTagValidate(data.name);
      return await this.createTechTagUseCase.execute(data.name, data?.code);
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('tag')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async getAllTechTags(): Promise<TechTag[]> {
    try {
      return await this.findMethodsTechTagUseCase.getAll();
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async getShapeById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TechTaskShapeResponseDto> {
    try {
      const { ability } = req;
      const techTask = await this.techTaskValidateRules.getShapeByIdValidate(
        id,
        ability,
      );
      return await this.shapeTechTaskUseCase.execute(techTask);
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Post(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async completionShapeById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: TechTaskCompletionShapeDto | itemValueDto[],
  ): Promise<TechTask> {
    try {
      const { ability, user } = req;


      const valueData = Array.isArray(data) ? data : data.valueData;
      
      if (!valueData || !Array.isArray(valueData)) {
        throw new Error('valueData must be an array');
      }

      const itemIds = valueData.map((item) => item.itemValueId);
      const techTask =
        await this.techTaskValidateRules.completionShapeByIdValidate(
          id,
          itemIds,
          ability,
        );
      return await this.completionShapeTechTaskUseCase.execute(
        techTask,
        valueData,
        user,
      );
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Get(':id/comments')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async getComments(
    @Request() req: any,
    @Param('id', ParseIntPipe) techTaskId: number,
  ): Promise<TechTaskCommentResponseDto[]> {
    try {
      const { ability } = req;
      await this.techTaskValidateRules.getShapeByIdValidate(techTaskId, ability);
      
      return await this.readTechTaskCommentsUseCase.execute(techTaskId);
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post(':id/comments')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(201)
  async createComment(
    @Request() req: any,
    @Param('id', ParseIntPipe) techTaskId: number,
    @Body() data: TechTaskCommentCreateDto,
  ): Promise<TechTaskCommentResponseDto> {
    try {
      const { ability, user } = req;
      await this.techTaskValidateRules.getShapeByIdValidate(techTaskId, ability);
      
      return await this.createTechTaskCommentUseCase.execute(data, techTaskId, user.id);
    } catch (e) {
      if (e instanceof TechTaskException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
