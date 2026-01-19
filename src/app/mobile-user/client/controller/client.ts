import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Patch,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GetByIdClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-get-by-id';
import { DeleteClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-delete';
import { UpdateAccountUseCase } from '../use-cases/update-account.use-case';
import { GetCurrentAccountUseCase } from '../use-cases/get-current-account.use-case';
import { CreateClientMetaUseCase } from '../use-cases/create-client-meta.use-case';
import { UpdateClientMetaUseCase } from '../use-cases/update-client-meta.use-case';
import { GetActivePromotionsForClientUseCase } from '@loyalty/mobile-user/client/use-cases/get-active-promotions-for-client';
import { CreateClientUseCaseWrapper } from '../use-cases/create-client.use-case';
import { UpdateClientUseCaseWrapper } from '../use-cases/update-client.use-case';
import { CreateClientDto } from './dto/client-create.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AccountClientUpdateDto } from './dto/account-client-update.dto';
import { ClientMetaCreateDto } from './dto/client-meta-create.dto';
import { ClientMetaUpdateDto } from './dto/client-meta-update.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { JwtGuard } from '@mobile-user/auth/guards/jwt.guard';

@Controller('client')
export class ClientController {
  constructor(
    private readonly getClientByIdUseCase: GetByIdClientUseCase,
    private readonly createClientUseCaseWrapper: CreateClientUseCaseWrapper,
    private readonly updateClientUseCaseWrapper: UpdateClientUseCaseWrapper,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
    private readonly getCurrentAccountUseCase: GetCurrentAccountUseCase,
    private readonly createClientMetaUseCase: CreateClientMetaUseCase,
    private readonly updateClientMetaUseCase: UpdateClientMetaUseCase,
    private readonly getActivePromotionsUseCase: GetActivePromotionsForClientUseCase,
  ) {}
  @Post()
  @HttpCode(201)
  async createClient(
    @Body() createData: CreateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.createClientUseCaseWrapper.execute(createData);
    return new ClientResponseDto(client);
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  async getCurrentAccount(@Request() req: any): Promise<any> {
    const { user } = req;

    return await this.getCurrentAccountUseCase.execute(user.props.id);
  }

  @Get('/activePromotion')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  async getActivePromotion(
    @Request() request: any,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
  ): Promise<any> {
    const { user } = request;
    const location =
      latitude !== undefined && longitude !== undefined
        ? { latitude, longitude }
        : undefined;
    return await this.getActivePromotionsUseCase.execute(
      user.props.id,
      location,
    );
  }

  @Patch('/account/update')
  @UseGuards(JwtGuard)
  async updateAccountInfo(
    @Body() body: AccountClientUpdateDto,
    @Request() req: any,
  ) {
    const { user } = req;

    const accountData = await this.getCurrentAccountUseCase.execute(
      user.props.id,
    );
    const currentClient = accountData.client;

    return await this.updateAccountUseCase.execute(body, currentClient);
  }

  @Post('/meta/create')
  @HttpCode(201)
  @UseGuards(JwtGuard)
  async createMeta(@Body() body: ClientMetaCreateDto): Promise<any> {
    return await this.createClientMetaUseCase.execute(body);
  }

  @Post('/meta/update')
  @HttpCode(201)
  @UseGuards(JwtGuard)
  async updateMeta(@Body() body: ClientMetaUpdateDto): Promise<any> {
    await this.updateClientMetaUseCase.execute(body);
    return { status: 'SUCCESS' };
  }

  @Delete()
  @UseGuards(JwtGuard)
  @HttpCode(204)
  async deleteAccount(@Request() request: any): Promise<void> {
    const { user } = request;
    await this.deleteClientUseCase.execute(user.props.id);
  }

  @Get(':id')
  @HttpCode(200)
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientResponseDto> {
    const client = await this.getClientByIdUseCase.execute(id);
    return new ClientResponseDto(client);
  }

  @Put(':id')
  @HttpCode(200)
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClientUseCaseWrapper.execute(
      id,
      updateData,
    );
    return new ClientResponseDto(client);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteClient(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteClientUseCase.execute(id);
  }
}
