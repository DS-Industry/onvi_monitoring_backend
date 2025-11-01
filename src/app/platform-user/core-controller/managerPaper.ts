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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-create';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateManagerPaperAbility,
  DeleteManagerPaperAbility,
  ManageManagerPaperAbility,
  ReadManagerPaperAbility,
  UpdateManagerPaperAbility,
} from '@common/decorators/abilities.decorator';
import { ManagerPaper } from '@manager-paper/managerPaper/domain/managerPaper';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManagerPaperException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { ManagerPaperCreateDto } from '@platform-user/core-controller/dto/receive/managerPaper-create.dto';
import { UpdateManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-update';
import { ManagerPaperUpdateDto } from '@platform-user/core-controller/dto/receive/managerPaper-update.dto';
import { ManagerPaperValidateRules } from '@platform-user/validate/validate-rules/manager-paper-validate-rules';
import { ManagerPaperFilterDto } from '@platform-user/core-controller/dto/receive/managerPaper-filter.dto';
import { ManagerPapersResponseDto } from '@platform-user/core-controller/dto/response/managerPapers-response.dto';
import { FindMethodsManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-find-methods';
import { DeleteManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-delete';
import { ManagerPaperType } from '@manager-paper/managerPaperType/domain/managerPaperType';
import { FindMethodsManagerPaperTypeUseCase } from '@manager-paper/managerPaperType/use-case/managerPaperType-find-methods';
import { ManagerReportPeriod } from '@manager-paper/managerReportPeriod/domain/managerReportPeriod';
import { ManagerReportPeriodCreateDto } from '@platform-user/core-controller/dto/receive/managerReportPeriod-create.dto';
import { CreateManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-create';
import { ManagerReportPeriodsResponseDto } from '@platform-user/core-controller/dto/response/managerReportPeriods-response.dto';
import { GetAllByFilterManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-get-all-by-filter';
import { ManagerReportPeriodFilterDto } from '@platform-user/core-controller/dto/receive/managerReportPeriod-filter.dto';
import { GetDetailDto } from '@manager-paper/managerReportPeriod/use-case/dto/get-detail.dto';
import { GetDetailManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-get-detail';
import { DeleteManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-delete';
import { ManagerReportPeriodUpdateDto } from '@platform-user/core-controller/dto/receive/managerReportPeriod-update.dto';
import { UpdateManagerReportPeriodUseCase } from '@manager-paper/managerReportPeriod/use-case/managerReportPeriod-update';
import { ManagerPapersStatisticResponseDto } from '@platform-user/core-controller/dto/response/managerPapersStatistic-response.dto';
import { StatisticManagerPaperUseCase } from '@manager-paper/managerPaper/use-case/managerPaper-statistic';
import { ManagerPaperTypeCreateDto } from '@platform-user/core-controller/dto/receive/managerPaperType-create.dto';
import { CreateManagerPaperTypeUseCase } from '@manager-paper/managerPaperType/use-case/managerPaperType-create';
import { ManagerPaperTypeUpdateDto } from '@platform-user/core-controller/dto/receive/managerPaperType-update.dto';
import { UpdateManagerPaperTypeUseCase } from '@manager-paper/managerPaperType/use-case/managerPaperType-update';
import { DeleteManyDto } from '@platform-user/core-controller/dto/receive/delete-many.dto';
import { ManagerReportPeriodStatus } from '@prisma/client';

@Controller('manager-paper')
export class ManagerPaperController {
  constructor(
    private readonly createManagerPaperUseCase: CreateManagerPaperUseCase,
    private readonly updateManagerPaperUseCase: UpdateManagerPaperUseCase,
    private readonly findMethodsManagerPaperUseCase: FindMethodsManagerPaperUseCase,
    private readonly deleteManagerPaperUseCase: DeleteManagerPaperUseCase,
    private readonly findMethodsManagerPaperTypeUseCase: FindMethodsManagerPaperTypeUseCase,
    private readonly createManagerReportPeriodUseCase: CreateManagerReportPeriodUseCase,
    private readonly getAllByFilterManagerReportPeriodUseCase: GetAllByFilterManagerReportPeriodUseCase,
    private readonly getDetailManagerReportPeriodUseCase: GetDetailManagerReportPeriodUseCase,
    private readonly deleteManagerReportPeriodUseCase: DeleteManagerReportPeriodUseCase,
    private readonly updateManagerReportPeriodUseCase: UpdateManagerReportPeriodUseCase,
    private readonly statisticManagerPaperUseCase: StatisticManagerPaperUseCase,
    private readonly createManagerPaperTypeUseCase: CreateManagerPaperTypeUseCase,
    private readonly updateManagerPaperTypeUseCase: UpdateManagerPaperTypeUseCase,
    private readonly managerPaperValidateRules: ManagerPaperValidateRules,
  ) {}
  //Create managePaper
  @Post()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateManagerPaperAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async createManagerPaper(
    @Request() req: any,
    @Body() data: ManagerPaperCreateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ManagerPaper> {
    try {
      const { user } = req;
      if (file) {
        return await this.createManagerPaperUseCase.execute(data, user, file);
      } else {
        return await this.createManagerPaperUseCase.execute(data, user);
      }
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  //Update managePaper
  @Patch()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateManagerPaperAbility())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async updateManagerPaper(
    @Request() req: any,
    @Body() data: ManagerPaperUpdateDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ManagerPaper> {
    try {
      const { user, ability } = req;
      const managerPaper =
        await this.managerPaperValidateRules.updateManagerPaperValidate(
          data.managerPaperId,
          ability,
        );
      if (file) {
        return await this.updateManagerPaperUseCase.execute(
          data,
          managerPaper,
          user,
          file,
        );
      } else {
        return await this.updateManagerPaperUseCase.execute(
          data,
          managerPaper,
          user,
        );
      }
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  //Get managePapers by filter
  @Get()
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadManagerPaperAbility())
  @HttpCode(201)
  async getManagerPapers(
    @Request() req: any,
    @Query() data: ManagerPaperFilterDto,
  ): Promise<ManagerPapersResponseDto> {
    try {
      const { ability } = req;

      let skip = undefined;
      let take = undefined;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      const totalCount =
        await this.findMethodsManagerPaperUseCase.getCountAllByFilter({
          ability,
          group: data.group,
          posId: data.posId,
          paperTypeId: data.paperTypeId,
          userId: data.userId,
          dateStartEvent: data.dateStartEvent,
          dateEndEvent: data.dateEndEvent,
        });
      const managerPapers =
        await this.findMethodsManagerPaperUseCase.getAllByFilter({
          ability,
          group: data.group,
          posId: data.posId,
          paperTypeId: data.paperTypeId,
          userId: data.userId,
          dateStartEvent: data.dateStartEvent,
          dateEndEvent: data.dateEndEvent,
          skip,
          take,
        });
      return { managerPapers: managerPapers, totalCount: totalCount };
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Get('statistic')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadManagerPaperAbility())
  @HttpCode(201)
  async getManagerPapersStatistic(
    @Request() req: any,
    @Query() data: ManagerPaperFilterDto,
  ): Promise<ManagerPapersStatisticResponseDto> {
    try {
      const { ability } = req;

      return await this.statisticManagerPaperUseCase.execute({
        ability,
        group: data.group,
        posId: data.posId,
        paperTypeId: data.paperTypeId,
        userId: data.userId,
        dateStartEvent: data.dateStartEvent,
        dateEndEvent: data.dateEndEvent,
      });
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Delete('many')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new DeleteManagerPaperAbility())
  @HttpCode(201)
  async deleteManyManagerPaper(
    @Request() req: any,
    @Body() data: DeleteManyDto,
  ): Promise<{ status: string }> {
    try {
      const { ability } = req;
      const managerPapers = await Promise.all(
        data.ids.map((id) =>
          this.managerPaperValidateRules.deleteManagerPaperValidate(
            id,
            ability,
          ),
        ),
      );

      await Promise.all(
        managerPapers.map((paper) =>
          this.deleteManagerPaperUseCase.execute(paper),
        ),
      );
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Delete('/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new DeleteManagerPaperAbility())
  @HttpCode(201)
  async deleteManagerPaper(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ status: string }> {
    try {
      const { ability } = req;
      const managerPaper =
        await this.managerPaperValidateRules.deleteManagerPaperValidate(
          id,
          ability,
        );
      await this.deleteManagerPaperUseCase.execute(managerPaper);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Post('type')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageManagerPaperAbility())
  @HttpCode(201)
  async createManagerPaperTypes(
    @Body() data: ManagerPaperTypeCreateDto,
  ): Promise<ManagerPaperType> {
    try {
      return await this.createManagerPaperTypeUseCase.execute(data);
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Get('type')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadManagerPaperAbility())
  @HttpCode(201)
  async getAllManagerPaperTypes(): Promise<ManagerPaperType[]> {
    try {
      return await this.findMethodsManagerPaperTypeUseCase.getAll();
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Patch('type')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateManagerPaperAbility())
  @HttpCode(201)
  async updateManagerPaperTypes(
    @Body() data: ManagerPaperTypeUpdateDto,
  ): Promise<ManagerPaperType> {
    try {
      const managerReportType =
        await this.managerPaperValidateRules.updateManagerPaperTypeValidate(
          data.managerPaperTypeId,
        );
      return await this.updateManagerPaperTypeUseCase.execute(
        data,
        managerReportType,
      );
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Post('period')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateManagerPaperAbility())
  @HttpCode(201)
  async createManagerPaperPeriod(
    @Request() req: any,
    @Body() data: ManagerReportPeriodCreateDto,
  ): Promise<ManagerReportPeriod> {
    try {
      const { user } = req;
      return await this.createManagerReportPeriodUseCase.execute(data, user);
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Get('period')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadManagerPaperAbility())
  @HttpCode(201)
  async getManagerPaperPeriods(
    @Request() req: any,
    @Query() data: ManagerReportPeriodFilterDto,
  ): Promise<ManagerReportPeriodsResponseDto> {
    try {
      let skip = undefined;
      let take = undefined;
      if (data.page && data.size) {
        skip = data.size * (data.page - 1);
        take = data.size;
      }
      return await this.getAllByFilterManagerReportPeriodUseCase.execute({
        startPeriod: data.startPeriod,
        endPeriod: data.endPeriod,
        userId: data.userId,
        skip,
        take,
      });
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Patch('period')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateManagerPaperAbility())
  @HttpCode(201)
  async updateManagerPaperPeriod(
    @Request() req: any,
    @Body() data: ManagerReportPeriodUpdateDto,
  ): Promise<ManagerReportPeriod> {
    try {
      const { user } = req;
      const managerReportPeriod =
        await this.managerPaperValidateRules.getDetailManagerPaperPeriodValidate(
          data.managerReportPeriodId,
        );
      return await this.updateManagerReportPeriodUseCase.execute(
        data,
        managerReportPeriod,
        user,
      );
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Patch('period/send/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateManagerPaperAbility())
  @HttpCode(201)
  async sendManagerPaperPeriod(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ManagerReportPeriod> {
    try {
      const { user } = req;
      const managerReportPeriod =
        await this.managerPaperValidateRules.getDetailManagerPaperPeriodValidate(
          id,
        );
      return await this.updateManagerReportPeriodUseCase.execute(
        { status: ManagerReportPeriodStatus.SENT },
        managerReportPeriod,
        user,
      );
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Patch('period/return/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageManagerPaperAbility())
  @HttpCode(201)
  async returnManagerPaperPeriod(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ManagerReportPeriod> {
    try {
      const { user } = req;
      const managerReportPeriod =
        await this.managerPaperValidateRules.getDetailManagerPaperPeriodValidate(
          id,
        );
      return await this.updateManagerReportPeriodUseCase.execute(
        { status: ManagerReportPeriodStatus.SAVE },
        managerReportPeriod,
        user,
      );
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Get('period/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadManagerPaperAbility())
  @HttpCode(201)
  async getDetailManagerPaperPeriod(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetDetailDto> {
    try {
      const managerReportPeriod =
        await this.managerPaperValidateRules.getDetailManagerPaperPeriodValidate(
          id,
        );
      return await this.getDetailManagerReportPeriodUseCase.execute(
        managerReportPeriod,
      );
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
  @Delete('period/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new DeleteManagerPaperAbility())
  @HttpCode(201)
  async deleteManagerPaperPeriod(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ status: string }> {
    try {
      const managerReportPeriod =
        await this.managerPaperValidateRules.deleteManagerPaperPeriodValidate(
          id,
        );
      await this.deleteManagerReportPeriodUseCase.execute(managerReportPeriod);
      return { status: 'SUCCESS' };
    } catch (e) {
      if (e instanceof ManagerPaperException) {
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
