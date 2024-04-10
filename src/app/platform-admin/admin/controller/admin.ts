import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get(':id')
  @HttpCode(200)
  async getOneById(): Promise<any> {
    try {
      return 200;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('')
  @HttpCode(201)
  async create(@Body() body: any): Promise<any> {
    try {
      return 201;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('list')
  @HttpCode(200)
  async createList(): Promise<any> {
    try {
      return 200;
    } catch (e) {
      throw new Error(e);
    }
  }
}
