import { Body, Controller, HttpCode, Post, Req, Request } from '@nestjs/common';
import { CreateApiKeyUseCase } from '../user-cases/create-api-key';
import { CreateApiKeyDto } from '../controller/dto/create-api-key-dto';

@Controller('auth')
export class Auth {
  constructor(private readonly authApiKey: CreateApiKeyUseCase) {}
  @Post('/login')
  @HttpCode(201)
  async login(
    @Body() body: CreateApiKeyDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      return await this.authApiKey.execute(body.organiationId);
    } catch (e) {
      throw new Error(e);
    }
  }
}
