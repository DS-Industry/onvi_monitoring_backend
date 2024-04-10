import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/login')
  @HttpCode(201)
  async login(@Body() body: any): Promise<any> {
    try {
      return 201;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: any): Promise<any> {
    try {
      return 201;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/verify')
  @HttpCode(201)
  async verify(@Body() body: any): Promise<any> {
    try {
      return 201;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/password/reset')
  @HttpCode(201)
  async reset(@Body() body: any): Promise<any> {
    try {
      return 201;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('/refresh')
  @HttpCode(200)
  async refresh(): Promise<any> {
    try {
      return 201;
    } catch (e) {
      throw new Error(e);
    }
  }
}
