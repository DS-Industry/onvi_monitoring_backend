import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { PosCreateDto } from '@platform-user/pos/controller/dto/pos-create.dto';
import { PreCreatePosUseCase } from '@platform-user/pos/use-cases/pos-pre-create';
import { GetByIdPosUseCase } from '@pos/pos/use-cases/pos-get-by-id';

@Controller('pos')
export class PosController {
  constructor(
    private readonly preCreatePosUseCase: PreCreatePosUseCase,
    private readonly getByIdPosUseCase: GetByIdPosUseCase,
  ) {}

  @Post('')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async create(@Body() data: PosCreateDto, @Request() req: any): Promise<any> {
    try {
      const { user } = req;
      return await this.preCreatePosUseCase.execute(data, user);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id') data: string): Promise<any> {
    try {
      const id: number = parseInt(data, 10);
      return this.getByIdPosUseCase.execute(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
