import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { GetByIdClientDto } from '@mobile-user/client/controller/dto/client-get-by-id.dto';
import { GetByIdClientUseCase } from '@mobile-user/client/use-cases/client-get-by-id';

@Controller('client')
export class ClientController {
  constructor(private readonly clientGetById: GetByIdClientUseCase) {}
  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.clientGetById.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
