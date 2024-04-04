import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { PlatformAdminUseCase } from '../../useCases/platformAdmin.useCase';
import { CreatRequestPlatformAdminDtpDto } from './dto/creat-request-platformAdmin.dto';

@Controller('platformAdmin')
export class PlatformAdminController {
  constructor(private readonly platformAdminUseCase: PlatformAdminUseCase) {}

  @Get('/getId')
  @HttpCode(200)
  async getPlatformAdmin(@Body() data: any): Promise<any> {
    try {
      return this.platformAdminUseCase.findOnId(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/create')
  @HttpCode(200)
  async createPlatformAdmin(
    @Body() data: CreatRequestPlatformAdminDtpDto,
  ): Promise<any> {
    try {
      return this.platformAdminUseCase.create(data);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('/getAll')
  @HttpCode(200)
  async getAllPlatformAdmin(): Promise<any> {
    try {
      return this.platformAdminUseCase.findAll();
    } catch (e) {
      throw new Error(e);
    }
  }
}
