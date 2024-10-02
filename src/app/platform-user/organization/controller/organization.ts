import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
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
import { CreatePreDocumentDto } from '@platform-user/organization/controller/dto/document-pre-create.dto';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AddWorkerOrganizationDto } from '@platform-user/organization/controller/dto/organization-add-worker.dto';
import { FilterByUserOrganizationUseCase } from '@organization/organization/use-cases/organization-filter-by-user';
import { OrganizationDateDto } from '@platform-user/organization/controller/dto/organization-date.dto';
import { GetRatingOrganizationUseCase } from '@organization/organization/use-cases/organization-get-rating';
import { OrganizationStatisticsResponseDto } from '@platform-user/organization/controller/dto/organization-statistics-response.dto';
import { GetStatisticsOrganizationUseCase } from '@organization/organization/use-cases/organization-get-statistics';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { OrganizationValidateRules } from '@platform-user/organization/controller/validate/organization-validate-rules';
import { SendOrganizationConfirmMailUseCase } from '@organization/confirmMail/use-case/confirm-mail-send';
import { OrganizationCreateDto } from '@platform-user/organization/controller/dto/organization-create.dto';
import { FindMethodsOrganizationUseCase } from "@organization/organization/use-cases/organization-find-methods";
import { FindMethodsPosUseCase } from "@pos/pos/use-cases/pos-find-methods";

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationCreate: CreateOrganizationUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly findMethodsPosUseCase: FindMethodsPosUseCase,
    private readonly organizationAddDocuments: AddDocumentUseCase,
    private readonly filterByUserOrganizationUseCase: FilterByUserOrganizationUseCase,
    private readonly getRatingOrganizationUseCase: GetRatingOrganizationUseCase,
    private readonly getStatisticsOrganizationUseCase: GetStatisticsOrganizationUseCase,
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly sendOrganizationConfirmMailUseCase: SendOrganizationConfirmMailUseCase,
    private readonly organizationValidateRules: OrganizationValidateRules,
  ) {}

  @Get('test')
  @HttpCode(200)
  async test(@Request() req: any): Promise<any> {
    try {
      return await this.findMethodsOrganizationUseCase.getAllByUser(1);
    } catch (e) {
      throw new Error(e);
    }
  }
  @Post('')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async create(
    @Body() data: OrganizationCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.organizationValidateRules.createValidate(data.name);
      return await this.organizationCreate.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
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

  @Get('pos/test')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getPosesTest(@Request() req: any): Promise<any> {
    try {
      const { user } = req;
      const ability =
        await this.caslAbilityFactory.createForPlatformManager(user);
      return await this.findMethodsPosUseCase.getAllByAbility(ability);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('pos/:id')
  @HttpCode(200)
  async getPosesById(@Param('id', ParseIntPipe) id: number): Promise<any> {
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

  @Get('filter/:userId')
  @HttpCode(200)
  async filterViewOrganizationByUser(
    @Param('userId', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      return await this.filterByUserOrganizationUseCase.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('verificate')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async verificate(
    @Body() data: CreatePreDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      const updateData = {
        ...data,
      };
      await this.organizationValidateRules.verificateValidate(
        data.organizationId,
      );
      return await this.organizationAddDocuments.execute(updateData, file);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('rating/:orgId')
  @HttpCode(200)
  async ratingPosByOrg(
    @Param('orgId', ParseIntPipe) id: number,
    @Query() data: OrganizationDateDto,
  ): Promise<any> {
    try {
      const input = {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        organizationId: id,
      };
      return await this.getRatingOrganizationUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('statistics/:orgId')
  @HttpCode(200)
  async statisticsOrg(
    @Param('orgId', ParseIntPipe) id: number,
    @Query() data: OrganizationDateDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    try {
      const input = {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        organizationId: id,
      };
      return await this.getStatisticsOrganizationUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }
}
