import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateAdminUseCase } from '@platform-admin/admin/use-cases/admin-create';
import { GetByIdAdminUseCase } from '@platform-admin/admin/use-cases/admin-get-by-id';
import { CreateAdminDto } from '@platform-admin/admin/controller/dto/admin-create.dto';
import { GetByIdAdminDto } from '@platform-admin/admin/controller/dto/admin-get-by-id.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminCreate: CreateAdminUseCase,
    private readonly adminGetById: GetByIdAdminUseCase,
  ) {}
  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.adminGetById.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('')
  @HttpCode(201)
  async create(@Body() data: CreateAdminDto): Promise<any> {
    try {
      return this.adminCreate.execute(data);
    } catch (e) {
      throw new Error(e);
    }
  }
}
