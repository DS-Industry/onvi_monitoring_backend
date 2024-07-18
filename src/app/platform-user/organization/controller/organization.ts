import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
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
      return this.organizationGetAllByOwner.execute(id);
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
}
