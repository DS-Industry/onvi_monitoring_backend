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
import { CreateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-create';
import { UpdateClientUseCase } from '@loyalty/mobile-user/client/use-cases/client-update';
import { UpdateAccountUseCase } from '../use-cases/update-account.use-case';
import { GetCurrentAccountUseCase } from '../use-cases/get-current-account.use-case';
import { CreateClientMetaUseCase } from '../use-cases/create-client-meta.use-case';
import { UpdateClientMetaUseCase } from '../use-cases/update-client-meta.use-case';
import { GetClientFavoritesUseCase } from '../use-cases/get-client-favorites.use-case';
import { AddClientFavoriteUseCase } from '../use-cases/add-client-favorite.use-case';
import { RemoveClientFavoriteUseCase } from '../use-cases/remove-client-favorite.use-case';
import { GetActivePromotionsUseCase } from '../use-cases/get-active-promotions.use-case';
import { CreateClientDto } from './dto/client-create.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AccountClientUpdateDto } from './dto/account-client-update.dto';
import { ClientMetaCreateDto } from './dto/client-meta-create.dto';
import { ClientMetaUpdateDto } from './dto/client-meta-update.dto';
import { ClientFavoritesDto } from './dto/client-favorites.dto';
import { ClientResponseDto } from './dto/client-response.dto';
import { JwtGuard } from "@mobile-user/auth/guards/jwt.guard";
import { ContractType } from '@prisma/client';


@Controller('client')
export class ClientController {
  constructor(
    private readonly getClientByIdUseCase: GetByIdClientUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly updateAccountUseCase: UpdateAccountUseCase,
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
    // Map the DTO to core DTO format
    const coreCreateData = {
      name: createData.name,
      phone: createData.phone,
      email: createData.email,
      gender: createData.gender,
      contractType: createData.contractType || ContractType.INDIVIDUAL,
      comment: createData.comment,
      birthday: createData.birthday ? new Date(createData.birthday) : undefined,
      placementId: createData.placementId,
    };
    
    const client = await this.createClientUseCase.execute(coreCreateData);
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
    @Body() body: AccountClientUpdateDto,
    @Request() req: any,
  ) {
    const { user } = req;
    
    const accountData = await this.getCurrentAccountUseCase.execute(user.clientId);
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
  async deleteAccount(@Request() request: any): Promise<any> {
    const { user } = request;
    // Note: Core doesn't have a proper delete implementation
    // This would need to be implemented in the core or handled differently
    throw new Error('Delete functionality not implemented in core');
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
    return new ClientResponseDto(client);
  }

  @Put(':id')
  @HttpCode(200)
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    // First get the existing client
    const existingClient = await this.getClientByIdUseCase.execute(id);
    
    // Map the DTO to core DTO format
    const coreUpdateData = {
      name: updateData.name,
      status: updateData.status,
      avatar: updateData.avatar,
      refreshTokenId: updateData.refreshTokenId,
      email: updateData.email,
    };
    
    const client = await this.updateClientUseCase.execute(coreUpdateData, existingClient);
    return new ClientResponseDto(client);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteClient(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // Note: Core doesn't have a proper delete implementation
    // This would need to be implemented in the core or handled differently
    throw new Error('Delete functionality not implemented in core');
  }
}
