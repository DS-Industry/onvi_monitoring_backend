import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOrganizationUseCase } from '@organization/organization/use-cases/organization-create';
import { GetByIdOrganizationUseCase } from '@organization/organization/use-cases/organization-get-by-id';
import { AddDocumentUseCase } from '@organization/organization/use-cases/organization-add-documents';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePreDocumentDto } from '@platform-user/organization/controller/dto/document-pre-create.dto';
import { GetAllUsersOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-users';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { OrganizationPreCreateDto } from '@platform-user/organization/controller/dto/organization-pre-create.dto';
import { AddWorkerOrganizationDto } from '@platform-user/organization/controller/dto/organization-add-worker.dto';
import { PreAddWorkerOrganizationUseCase } from '@platform-user/organization/use-cases/organization-pre-add-worker';
import { GetAllOrganizationByOwnerUseCase } from '@organization/organization/use-cases/organization-get-all-by-owner';
import { GetAllPosOrganizationUseCase } from '@organization/organization/use-cases/organization-get-all-pos';
import { FilterByUserOrganizationUseCase } from '@platform-user/organization/use-cases/organization-filter-by-user';
import { OrganizationDateDto } from '@platform-user/organization/controller/dto/organization-date.dto';
import { GetRatingOrganizationUseCase } from '@organization/organization/use-cases/organization-get-rating';
import { OrganizationStatisticsResponseDto } from '@platform-user/organization/controller/dto/organization-statistics-response.dto';
import { GetStatisticsOrganizationUseCase } from '@organization/organization/use-cases/organization-get-statistics';
import { AbilityFactory } from '@platform-user/permissions/ability.factory';
import { GetAllByPermissionPosUseCase } from '@pos/pos/use-cases/pos-get-all-by-permission';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationCreate: CreateOrganizationUseCase,
    private readonly organizationGetById: GetByIdOrganizationUseCase,
    private readonly organizationAddDocuments: AddDocumentUseCase,
    private readonly organizationGetAllUsers: GetAllUsersOrganizationUseCase,
    private readonly preOrganizationAddWorker: PreAddWorkerOrganizationUseCase,
    private readonly organizationGetAllByOwner: GetAllOrganizationByOwnerUseCase,
    private readonly organizationGetAllPos: GetAllPosOrganizationUseCase,
    private readonly filterByUserOrganizationUseCase: FilterByUserOrganizationUseCase,
    private readonly getRatingOrganizationUseCase: GetRatingOrganizationUseCase,
    private readonly getStatisticsOrganizationUseCase: GetStatisticsOrganizationUseCase,
    private readonly caslAbilityFactory: AbilityFactory,
    private readonly getAllByPermissionPosUseCase: GetAllByPermissionPosUseCase,
  ) {}

  @Post('')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async create(
    @Body() data: OrganizationPreCreateDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
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
      return await this.preOrganizationAddWorker.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.organizationGetById.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('worker/:id')
  @HttpCode(200)
  async getUsersById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.organizationGetAllUsers.execute(id);
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
      return await this.getAllByPermissionPosUseCase.execute(ability);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('pos/:id')
  @HttpCode(200)
  async getPosesById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.organizationGetAllPos.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('owner/:id')
  @HttpCode(200)
  async getOrganizationByOwner(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return await this.organizationGetAllByOwner.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('filter/:userId')
  @HttpCode(200)
  async filterViewOrganizationByUser(
    @Param('userId') data: string,
  ): Promise<any> {
    try {
      const userId = parseInt(data, 10);
      return await this.filterByUserOrganizationUseCase.execute(userId);
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
        organizationId: Number(data.organizationId),
      };

      return await this.organizationAddDocuments.execute(updateData, file);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('rating/:orgId')
  @HttpCode(200)
  async ratingPosByOrg(
    @Param('orgId') orgId: string,
    @Query() data: OrganizationDateDto,
  ): Promise<any> {
    try {
      const id: number = parseInt(orgId, 10);
      const input = {
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
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
    @Param('orgId') orgId: string,
    @Query() data: OrganizationDateDto,
  ): Promise<OrganizationStatisticsResponseDto> {
    try {
      const id: number = parseInt(orgId, 10);
      const input = {
        dateStart: new Date(data.dateStart),
        dateEnd: new Date(data.dateEnd),
        organizationId: id,
      };
      return await this.getStatisticsOrganizationUseCase.execute(input);
    } catch (e) {
      throw new Error(e);
    }
  }
}
