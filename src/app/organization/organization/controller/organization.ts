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
import { CreatePreDocumentDto } from '@organization/organization/controller/dto/document-pre-create.dto';
import { GetAllUsersOrganization } from '@organization/organization/use-cases/organization-get-all-users';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { OrganizationPreCreateDto } from '@organization/organization/controller/dto/organization-pre-create.dto';
import { AddWorkerOrganizationDto } from '@organization/organization/controller/dto/organization-add-worker.dto';
import { AddWorkerOrganizationUseCase } from '@organization/organization/use-cases/organization-add-worker';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationCreate: CreateOrganizationUseCase,
    private readonly organizationGetById: GetByIdOrganizationUseCase,
    private readonly organizationAddDocuments: AddDocumentUseCase,
    private readonly organizationGetAllUsers: GetAllUsersOrganization,
    private readonly organizationAddWorker: AddWorkerOrganizationUseCase,
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
      return await this.organizationAddWorker.execute(data, user);
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
