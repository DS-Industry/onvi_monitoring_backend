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
import { GetClientByIdUseCase } from '../use-cases/get-client-by-id.use-case';
import { CreateClientUseCase } from '../use-cases/create-client.use-case';
import { UpdateClientUseCase } from '../use-cases/update-client.use-case';
import { DeleteClientUseCase } from '../use-cases/delete-client.use-case';
import { GetCurrentAccountUseCase } from '../use-cases/get-current-account.use-case';
import { CreateClientMetaUseCase } from '../use-cases/create-client-meta.use-case';
import { UpdateClientMetaUseCase } from '../use-cases/update-client-meta.use-case';
import { GetClientFavoritesUseCase } from '../use-cases/get-client-favorites.use-case';
import { AddClientFavoriteUseCase } from '../use-cases/add-client-favorite.use-case';
import { RemoveClientFavoriteUseCase } from '../use-cases/remove-client-favorite.use-case';
import { GetActivePromotionsUseCase } from '../use-cases/get-active-promotions.use-case';
import { CreateClientDto } from './dto/client-create.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientMetaCreateDto } from './dto/client-meta-create.dto';
import { ClientMetaUpdateDto } from './dto/client-meta-update.dto';
import { ClientFavoritesDto } from './dto/client-favorites.dto';
import { ClientNotificationsDto } from './dto/client-notifications.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { JwtGuard } from "@mobile-user/auth/guards/jwt.guard";


@Controller('client')
export class ClientController {
  constructor(
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
    private readonly getCurrentAccountUseCase: GetCurrentAccountUseCase,
    private readonly createClientMetaUseCase: CreateClientMetaUseCase,
    private readonly updateClientMetaUseCase: UpdateClientMetaUseCase,
    private readonly getClientFavoritesUseCase: GetClientFavoritesUseCase,
    private readonly addClientFavoriteUseCase: AddClientFavoriteUseCase,
    private readonly removeClientFavoriteUseCase: RemoveClientFavoriteUseCase,
    private readonly getActivePromotionsUseCase: GetActivePromotionsUseCase,
  ) {}
  @Post()
  @HttpCode(201)
  async createClient(@Body() createData: CreateClientDto): Promise<ClientResponseDto> {
    const client = await this.createClientUseCase.execute(createData);
    return new ClientResponseDto(client);
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  async getCurrentAccount(@Request() req: any): Promise<any> {
    const { user } = req;
    return await this.getCurrentAccountUseCase.execute(user.clientId);
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
    return await this.getActivePromotionsUseCase.execute(user.clientId, location);
  }

  @Patch('/account/update')
  @UseGuards(JwtGuard)
  async updateAccountInfo(
    @Body() body: ClientUpdateDto,
    @Request() req: any,
  ) {
    const { user } = req;

    return await this.updateClientUseCase.execute(user.props.id, body);
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

  @Patch('notifications')
  @HttpCode(201)
  @UseGuards(JwtGuard)
  async updateNotifications(
    @Body() body: ClientNotificationsDto,
    @Request() request: any,
  ): Promise<any> {
    const { user } = request;
    
    return { status: 'SUCCESS', notification: body.notification };
  }

  @Delete()
  @UseGuards(JwtGuard)
  async deleteAccount(@Request() request: any): Promise<any> {
    const { user } = request;
    await this.deleteClientUseCase.execute(user.clientId);
    return { status: 'SUCCESS' };
  }

  @Get('/favorites')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  async getFavorites(@Request() request: any): Promise<number[]> {
    const { user } = request;
    return await this.getClientFavoritesUseCase.execute(user.clientId);
  }

  @Post('/favorites')
  @HttpCode(201)
  @UseGuards(JwtGuard)
  async addFavorites(@Body() body: ClientFavoritesDto, @Request() request: any): Promise<number[]> {
    const { user } = request;
    return await this.addClientFavoriteUseCase.execute(user.clientId, body);
  }

  @Delete('/favorites')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  async removeFavorite(@Body() body: ClientFavoritesDto, @Request() request: any): Promise<number[]> {
    const { user } = request;
    return await this.removeClientFavoriteUseCase.execute(user.clientId, body);
  }


  @Get(':id')
  @HttpCode(200)
  async getOneById(@Param('id', ParseIntPipe) id: number): Promise<ClientResponseDto> {
    const client = await this.getClientByIdUseCase.execute(id);
    console.log('hey hey hye')
    return new ClientResponseDto(client);
  }

  @Put(':id')
  @HttpCode(200)
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClientUseCase.execute(id, updateData);
    return new ClientResponseDto(client);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteClient(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteClientUseCase.execute(id);
  }
}
