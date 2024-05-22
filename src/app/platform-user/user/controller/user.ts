import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor() {}
  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: any): Promise<any> {
    try {
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('')
  @HttpCode(201)
  async create(@Body() data: any): Promise<any> {
    try {
    } catch (e) {
      throw new Error(e);
    }
  }
}
