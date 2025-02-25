import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
import { DataFilterDto } from '@platform-user/core-controller/dto/receive/data-filter.dto';
import { GeneratingReportProgramTechRate } from '@tech-task/programTechRate/use-cases/programTechRate-generating-report';
import { PosChemistryProductionUseCase } from '@pos/pos/use-cases/pos-chemistry-production';
import { FindMethodsItemTemplateUseCase } from '@tech-task/itemTemplate/use-cases/itemTemplate-find-methods';
import { ReadAllByPosTechTaskUseCase } from '@tech-task/techTask/use-cases/techTask-read-all-by-pos';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PosException, TechTaskException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { TechTaskManageInfoResponseDto } from "@tech-task/techTask/use-cases/dto/techTask-manage-info-response.dto";
import { TechTaskShapeResponseDto } from "@tech-task/techTask/use-cases/dto/techTask-read-response.dto";

@Controller('tech-task')
export class TechTaskController {
  constructor(
    private readonly createTechTaskUseCase: CreateTechTaskUseCase,
    private readonly techTaskValidateRules: TechTaskValidateRules,
    private readonly updateTechTaskUseCase: UpdateTechTaskUseCase,
    private readonly manageAllByPosAndStatusesTechTaskUseCase: ManageAllByPosAndStatusesTechTaskUseCase,
    private readonly readAllByPosTechTaskUseCase: ReadAllByPosTechTaskUseCase,
    private readonly shapeTechTaskUseCase: ShapeTechTaskUseCase,
    private readonly generatingReportProgramTechRate: GeneratingReportProgramTechRate,
    private readonly posChemistryProductionUseCase: PosChemistryProductionUseCase,
    private readonly completionShapeTechTaskUseCase: CompletionShapeTechTaskUseCase,
    private readonly findMethodsItemTemplateUseCase: FindMethodsItemTemplateUseCase,
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
  //Get all techTask for manage by id
  @Get('manage/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateTechTaskAbility())
  @HttpCode(200)
  async getAllForManage(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
  ): Promise<TechTaskManageInfoResponseDto[]> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(posId, ability);
      return await this.manageAllByPosAndStatusesTechTaskUseCase.execute(
        posId,
        [StatusTechTask.ACTIVE, StatusTechTask.PAUSE],
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
  //Get all techTask for read by id
  @Get('read/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async getAllForRead(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
  ): Promise<TechTaskShapeResponseDto[]> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(posId, ability);
      return await this.readAllByPosTechTaskUseCase.execute(posId);
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
  //Get all items
  @Get('item')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAllItems(): Promise<any> {
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
  //Get shape techTask by id
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
  //Completion shape techTask by id
  @Post(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(200)
  async completionShapeById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: TechTaskCompletionShapeDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ): Promise<any> {
    try {
      const { ability, user } = req;

      const valueWithFiles = data.valueData.map((item) => {
        if (files) {
          const matchingFile = files.find(
            (file) => file.fieldname === item.itemValueId.toString(),
          );
          return {
            ...item,
            file: matchingFile || undefined,
          };
        } else {
          return { ...item };
        }
      });

      const itemIds = valueWithFiles.map((item) => item.itemValueId);
      const techTask =
        await this.techTaskValidateRules.completionShapeByIdValidate(
          id,
          itemIds,
          ability,
        );
      return await this.completionShapeTechTaskUseCase.execute(
        techTask,
        valueWithFiles,
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
  //TechRate generating report
  @Get('chemistry-report/:posId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadTechTaskAbility())
  @HttpCode(200)
  async chemistryReport(
    @Request() req: any,
    @Param('posId', ParseIntPipe) posId: number,
    @Query() data: DataFilterDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      await this.posValidateRules.getOneByIdValidate(posId, ability);
      const techRateInfo = await this.generatingReportProgramTechRate.execute(
        posId,
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
}
