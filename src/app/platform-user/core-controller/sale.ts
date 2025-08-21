import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { SalePriceCreateDto } from '@platform-user/core-controller/dto/receive/sale-price-create.dto';
import { SalePrice } from '@warehouse/sale/MNGSalePrice/domain/salePrice';
import { SaleException } from '@exception/option.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';
import { CreateSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-create';
import { PaginationDto } from '@platform-user/core-controller/dto/receive/pagination.dto';
import { FindMethodsSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-find-methods';
import { UpdateSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-update';
import { SalePriceUpdateDto } from '@platform-user/core-controller/dto/receive/sale-price-update.dto';
import { CreateSaleDocumentUseCase } from '@warehouse/sale/MNGSaleDocument/use-cases/saleDocument-create';
import { SaleDocument } from '@warehouse/sale/MNGSaleDocument/domain/saleDocument';
import { SaleDocumentCreateDto } from '@platform-user/core-controller/dto/receive/sale-document-create.dto';
import { WarehouseValidateRules } from '@platform-user/validate/validate-rules/warehouse-validate-rules';
import { User } from '@platform-user/user/domain/user';
import { FindMethodsUserUseCase } from '@platform-user/user/use-cases/user-find-methods';
import { MANAGER_REPORT_PERIOD_ROLE_IDS } from '@constant/constants';

@Controller('sale')
export class SaleController {
  constructor(
    private readonly warehouseValidateRules: WarehouseValidateRules,
    private readonly createSalePriceUseCase: CreateSalePriceUseCase,
    private readonly findMethodsSalePriceUseCase: FindMethodsSalePriceUseCase,
    private readonly updateSalePriceUseCase: UpdateSalePriceUseCase,
    private readonly createSaleDocumentUseCase: CreateSaleDocumentUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
  ) {}
  @Post('document')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async createDocument(
    @Request() req: any,
    @Body() data: SaleDocumentCreateDto,
  ): Promise<SaleDocument> {
    try {
      const { user } = req;
      const validData =
        await this.warehouseValidateRules.createSaleDocumentValidate(data);
      return await this.createSaleDocumentUseCase.execute(
        { ...data, warehouse: validData.warehouse, manager: validData.manager },
        user,
      );
    } catch (e) {
      if (e instanceof SaleException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Post('price')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async createPrice(
    @Request() req: any,
    @Body() data: SalePriceCreateDto[],
  ): Promise<SalePrice[]> {
    try {
      return await this.createSalePriceUseCase.executeMany(data);
    } catch (e) {
      if (e instanceof SaleException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('manager/:warehouseId')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async getAllManager(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
  ): Promise<User[]> {
    try {
      const warehouse =
        await this.warehouseValidateRules.getOneByIdCheck(warehouseId);
      return await this.findMethodsUserUseCase.getAllByRoleIdsAndPosId(
        MANAGER_REPORT_PERIOD_ROLE_IDS,
        warehouse.posId,
      );
    } catch (e) {
      if (e instanceof SaleException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Patch('price')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async updatePrice(
    @Request() req: any,
    @Body() data: SalePriceUpdateDto,
  ): Promise<SalePrice[]> {
    try {
      return await this.updateSalePriceUseCase.updateValue(data.valueData);
    } catch (e) {
      if (e instanceof SaleException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  @Get('price/:warehouseId')
  @UseGuards(JwtGuard)
  @HttpCode(201)
  async getPriceTable(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query() params: PaginationDto,
  ): Promise<SalePrice[]> {
    try {
      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      return await this.findMethodsSalePriceUseCase.getAllByFilter({
        warehouseId,
        take,
        skip,
      });
    } catch (e) {
      if (e instanceof SaleException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
