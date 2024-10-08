import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { CreateOrganizationUseCase } from '@organization/organization/use-cases/organization-create';
import { AddDocumentUseCase } from '@organization/organization/use-cases/organization-add-documents';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddDocumentDto } from '@platform-user/core-controller/dto/receive/document-add.dto';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AddWorkerOrganizationDto } from '@platform-user/core-controller/dto/receive/organization-add-worker.dto';
import { FilterByUserOrganizationUseCase } from '@organization/organization/use-cases/organization-filter-by-user';
import { GetRatingOrganizationUseCase } from '@organization/organization/use-cases/organization-get-rating';
import { OrganizationStatisticsResponseDto } from '@platform-user/core-controller/dto/response/organization-statistics-response.dto';
import { GetStatisticsOrganizationUseCase } from '@organization/organization/use-cases/organization-get-statistics';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { OrganizationValidateRules } from '@platform-user/validate/validate-rules/organization-validate-rules';
import { SendOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-send';
import { OrganizationCreateDto } from '@platform-user/core-controller/dto/receive/organization-create.dto';
import { FindMethodsOrganizationUseCase } from '@organization/organization/use-cases/organization-find-methods';
import { DataFilterDto } from '@platform-user/core-controller/dto/receive/data-filter.dto';
import { OrganizationFilterResponseDto } from '@platform-user/core-controller/dto/response/organization-filter-response.dto';
import { PosResponseDto } from '@platform-user/core-controller/dto/response/pos-response.dto';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { OrganizationUpdateDto } from '@platform-user/core-controller/dto/receive/organization-update.dto';
import { UpdateOrganizationUseCase } from '@organization/organization/use-cases/organization-update';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationCreate: CreateOrganizationUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly organizationAddDocuments: AddDocumentUseCase,
    private readonly filterByUserOrganizationUseCase: FilterByUserOrganizationUseCase,
    private readonly getRatingOrganizationUseCase: GetRatingOrganizationUseCase,
    private readonly getStatisticsOrganizationUseCase: GetStatisticsOrganizationUseCase,
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly sendOrganizationConfirmMailUseCase: SendOrganizationConfirmMailUseCase,
    private readonly organizationValidateRules: OrganizationValidateRules,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
  ) {}
  @Post('')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async create(
    @Body() data: OrganizationCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.organizationValidateRules.createValidate(data.fullName);
      return await this.organizationCreate.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Patch('')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async update(
    @Request() req: any,
    @Body() data: OrganizationUpdateDto,
  ): Promise<any> {
    const { user } = req;
    await this.organizationValidateRules.updateValidate(data.organizationId);
    return await this.updateOrganizationUseCase.execute(data);
  }

  @Post('worker')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async addWorker(
    @Body() data: AddWorkerOrganizationDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.organizationValidateRules.addWorkerValidate(
        data.email,
        data.organizationId,
        user.id,
      );
      return await this.sendOrganizationConfirmMailUseCase.execute(
        data.email,
        'Приглашение в организацию:',
        data.organizationId,
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('statistics')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async statisticsOrg(
    @Request() req: any,
  ): Promise<OrganizationStatisticsResponseDto> {
    try {
      const { user } = req;
      const organizationId =
        await this.findMethodsUserUseCase.getOrgPermissionById(user.id);
      const today = new Date();
      const input = {
        dateStart: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0,
        ),
        dateEnd: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999,
        ),
        organizationId: organizationId[0],
      };
      return await this.getStatisticsOrganizationUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('rating')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async ratingPosByOrg(
    @Request() req: any,
    @Query() data: DataFilterDto,
  ): Promise<any> {
    try {
      const { user } = req;
      const organizationId =
        await this.findMethodsUserUseCase.getOrgPermissionById(user.id);
      const input = {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        organizationId: organizationId[0],
      };
      return await this.getRatingOrganizationUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      await this.organizationValidateRules.getOneByIdValidate(id);
      return this.findMethodsOrganizationUseCase.getById(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('worker/:id')
  @HttpCode(200)
  async getUsersById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return this.findMethodsOrganizationUseCase.getAllWorker(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('pos/:id')
  @HttpCode(200)
  async getPosesById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PosResponseDto[]> {
    try {
      return this.findMethodsOrganizationUseCase.getAllPos(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('owner/:id')
  @HttpCode(200)
  async getOrganizationByOwner(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      return await this.findMethodsOrganizationUseCase.getAllByOwner(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async filterViewOrganizationByUser(
    @Request() req: any,
  ): Promise<OrganizationFilterResponseDto[]> {
    try {
      const { user } = req;
      const ability =
        await this.caslAbilityFactory.createForPlatformManager(user);
      return await this.filterByUserOrganizationUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('verificate')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async verificate(
    @Body() data: AddDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      await this.organizationValidateRules.verificateValidate(
        data.organizationId,
      );
      return await this.organizationAddDocuments.execute(
        data.organizationId,
        file,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
