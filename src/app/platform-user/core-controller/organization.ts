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
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  CreateOrgAbility,
  ReadOrgAbility,
  ReadPosAbility,
  UpdateOrgAbility,
} from '@common/decorators/abilities.decorator';
import { OrganizationException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { FindMethodsDocumentUseCase } from '@organization/documents/use-cases/document-find-methods';
import { PlacementFilterDto } from '@platform-user/core-controller/dto/receive/placement-filter.dto';
import { OrganizationStatisticGrafResponseDto } from '@platform-user/core-controller/dto/response/organization-statistic-graf-response.dto';
import { GetStatisticsGrafOrganizationUseCase } from '@organization/organization/use-cases/organization-get-statistics-graf';
import { UpdateUserUseCase } from '@platform-user/user/use-cases/user-update';
import { StatusUser } from '@prisma/client';
import { OrganizationPreCreateDto } from '@platform-user/core-controller/dto/receive/organization-pre-create.dto';
import { PreCreateOrganizationUseCase } from '@organization/organization/use-cases/organization-pre-create';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationCreate: CreateOrganizationUseCase,
    private readonly preCreateOrganizationUseCase: PreCreateOrganizationUseCase,
    private readonly findMethodsOrganizationUseCase: FindMethodsOrganizationUseCase,
    private readonly organizationAddDocuments: AddDocumentUseCase,
    private readonly filterByUserOrganizationUseCase: FilterByUserOrganizationUseCase,
    private readonly getRatingOrganizationUseCase: GetRatingOrganizationUseCase,
    private readonly getStatisticsOrganizationUseCase: GetStatisticsOrganizationUseCase,
    private readonly sendOrganizationConfirmMailUseCase: SendOrganizationConfirmMailUseCase,
    private readonly organizationValidateRules: OrganizationValidateRules,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
    private readonly findMethodsDocumentUseCase: FindMethodsDocumentUseCase,
    private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
    private readonly getStatisticsGrafOrganizationUseCase: GetStatisticsGrafOrganizationUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}
  //All organization for user
  @Get('filter')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadOrgAbility())
  @HttpCode(200)
  async filterViewOrganizationByUser(
    @Request() req: any,
    @Query() data: PlacementFilterDto,
  ): Promise<OrganizationFilterResponseDto[]> {
    try {
      const { ability } = req;
      return await this.filterByUserOrganizationUseCase.execute(
        ability,
        data.placementId,
      );
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Create organization
  @Post('')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateOrgAbility())
  @HttpCode(201)
  async create(
    @Body() data: OrganizationCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.organizationValidateRules.createValidate(data.fullName);
      const newOrganization = await this.organizationCreate.execute(data, user);
      if (user.status == StatusUser.VERIFICATE) {
        await this.updateUserUseCase.execute({
          id: user.id,
          status: StatusUser.ACTIVE,
        });
      }
      return newOrganization;
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //PreCreate organization
  @Post('pre-create')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateOrgAbility())
  @HttpCode(201)
  async preCreate(
    @Body() data: OrganizationPreCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      await this.organizationValidateRules.createValidate(data.fullName);
      return await this.preCreateOrganizationUseCase.execute(data, user);
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Update organization
  @Patch('')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateOrgAbility())
  @HttpCode(201)
  async update(
    @Request() req: any,
    @Body() data: OrganizationUpdateDto,
  ): Promise<any> {
    try {
      const { ability, user } = req;
      const organization = await this.organizationValidateRules.updateValidate(
        data.organizationId,
        ability,
      );
      const newOrganization = await this.updateOrganizationUseCase.execute(
        data,
        organization,
      );
      if (user.status == StatusUser.VERIFICATE) {
        await this.updateUserUseCase.execute({
          id: user.id,
          status: StatusUser.ACTIVE,
        });
      }
      return newOrganization;
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Send email for add worker
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
        data,
        'Приглашение в организацию:',
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  //Statistics for organization
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
      if (e instanceof OrganizationException) {
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
  //Statistics-graf for organization
  @Get('statistics-graf')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @HttpCode(200)
  async statisticsGrafOrg(
    @Request() req: any,
    @Query() data: DataFilterDto,
  ): Promise<OrganizationStatisticGrafResponseDto[]> {
    try {
      const { ability } = req;
      return await this.getStatisticsGrafOrganizationUseCase.execute(
        data.dateStart,
        data.dateEnd,
        ability,
      );
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Rating for organization
  @Get('rating')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @HttpCode(200)
  async ratingPosByOrg(
    @Request() req: any,
    @Query() data: DataFilterDto,
  ): Promise<any> {
    try {
      const { ability } = req;
      return await this.getRatingOrganizationUseCase.execute(
        data.dateStart,
        data.dateEnd,
        ability,
      );
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Get org by id
  @Get(':id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getOneById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      return await this.organizationValidateRules.getOneByIdValidate(
        id,
        ability,
      );
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Get all worker for org
  @Get('worker/:id')
  @HttpCode(200)
  async getUsersById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      return this.findMethodsOrganizationUseCase.getAllWorker(id);
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Get all worker for org
  @Get('document/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getDocumentById(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      const { ability } = req;
      const organization =
        await this.organizationValidateRules.getOneByIdValidate(id, ability);
      return await this.findMethodsDocumentUseCase.getById(
        organization.organizationDocumentId,
      );
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Get all pos for org
  @Get('pos/:id')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadPosAbility())
  @HttpCode(200)
  async getPosesById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PosResponseDto[]> {
    try {
      return this.findMethodsOrganizationUseCase.getAllPos(id);
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Get all org for owner
  @Get('owner/:id')
  @HttpCode(200)
  async getOrganizationByOwner(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    try {
      return await this.findMethodsOrganizationUseCase.getAllByOwner(id);
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  @Get('contact/:id')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getContactData(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const organization = await this.organizationValidateRules.getContact(id);
      return {
        name: organization.name,
        address: organization?.address,
        status: organization.organizationStatus,
        type: organization.organizationType,
      };
    } catch (e) {
      if (e instanceof OrganizationException) {
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
  //Add document for org
  @Post('verificate')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async verificate(
    @Body() data: AddDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      const organization =
        await this.organizationValidateRules.verificateValidate(
          data.organizationId,
        );
      return await this.organizationAddDocuments.execute(organization, file);
    } catch (e) {
      if (e instanceof OrganizationException) {
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
