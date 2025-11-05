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
  Delete,
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
import { SalePriceResponseDto } from '@warehouse/sale/MNGSalePrice/use-cases/dto/salePrice-response.dto';
import { DeleteManyDto } from '@platform-user/core-controller/dto/receive/delete-many.dto';
import { DeleteSalePriceUseCase } from '@warehouse/sale/MNGSalePrice/use-cases/salePrice-delete';
import { SaleDocumentFilterDto } from '@platform-user/core-controller/dto/receive/sale-document-filter.dto';
import { FindMethodsSaleDocumentUseCase } from '@warehouse/sale/MNGSaleDocument/use-cases/saleDocument-find-methods';
import { SaleDocumentResponseDto } from '@warehouse/sale/MNGSaleDocument/use-cases/dto/saleDocument-response.dto';
import { SaleDocumentFullResponse } from '@warehouse/sale/MNGSaleDocument/use-cases/dto/saleDocument-full-response';
import { FindMethodsSaleItemUseCase } from '@warehouse/sale/MNGSaleItem/use-cases/saleItem-find-methods';
import {
  CheckAbilities,
  CreateManagerPaperAbility,
  ReadManagerPaperAbility, ReadWarehouseAbility, UpdateWarehouseAbility
} from "@common/decorators/abilities.decorator";
import { AbilitiesGuard } from "@platform-user/permissions/user-permissions/guards/abilities.guard";

@Controller('sale')
export class SaleController {
  constructor(
    private readonly warehouseValidateRules: WarehouseValidateRules,
    private readonly createSalePriceUseCase: CreateSalePriceUseCase,
    private readonly findMethodsSalePriceUseCase: FindMethodsSalePriceUseCase,
    private readonly updateSalePriceUseCase: UpdateSalePriceUseCase,
    private readonly createSaleDocumentUseCase: CreateSaleDocumentUseCase,
    private readonly findMethodsUserUseCase: FindMethodsUserUseCase,
    private readonly deleteSalePriceUseCase: DeleteSalePriceUseCase,
    private readonly findMethodsSaleDocumentUseCase: FindMethodsSaleDocumentUseCase,
    private readonly findMethodsSaleItemUseCase: FindMethodsSaleItemUseCase,
  ) {}
  @Post('document')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new CreateManagerPaperAbility())
  @HttpCode(201)
  async createDocument(
    @Request() req: any,
    @Body() data: SaleDocumentCreateDto,
  ): Promise<SaleDocumentFullResponse> {
    try {
      const { user } = req;
      const validData =
        await this.warehouseValidateRules.createSaleDocumentValidate(data);
      const saleDocument = await this.createSaleDocumentUseCase.execute(
        { ...data, warehouse: validData.warehouse, manager: validData.manager },
        user,
      );
      const details = await this.findMethodsSaleItemUseCase.getAllByFilter({
        mngSaleDocumentId: saleDocument.id,
      });
      return { ...saleDocument, details };
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
  @Get('document/:documentId')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadManagerPaperAbility())
  @HttpCode(201)
  async getDocument(
    @Request() req: any,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<SaleDocumentFullResponse> {
    try {
      const saleDocument =
        await this.warehouseValidateRules.getSaleDocumentValidate(documentId);
      const details = await this.findMethodsSaleItemUseCase.getAllByFilter({
        mngSaleDocumentId: saleDocument.id,
      });
      return { ...saleDocument, details };
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
  @Get('documents')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadManagerPaperAbility())
  @HttpCode(201)
  async getDocuments(
    @Request() req: any,
    @Query() params: SaleDocumentFilterDto,
  ): Promise<SaleDocumentResponseDto[]> {
    try {
      let skip = undefined;
      let take = undefined;
      if (params.page && params.size) {
        skip = params.size * (params.page - 1);
        take = params.size;
      }
      return this.findMethodsSaleDocumentUseCase.getAllByFilter({
        warehouseId: params.warehouseId,
        dateStartSale: params.dateStart,
        dateEndSale: params.dateEnd,
        skip: skip,
        take: take,
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
  @Post('price')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async createPrice(
    @Request() req: any,
    @Body() data: SalePriceCreateDto,
  ): Promise<SalePriceResponseDto> {
    try {
      return await this.createSalePriceUseCase.execute(data);
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
  ): Promise<{ id: number; name: string }[]> {
    try {
      const warehouse =
        await this.warehouseValidateRules.getOneByIdCheck(warehouseId);
      const managers =
        await this.findMethodsUserUseCase.getAllByRoleIdsAndPosId(
          MANAGER_REPORT_PERIOD_ROLE_IDS,
          warehouse.posId,
        );
      return managers.map((manager) => {
        return { id: manager.id, name: manager.surname + ' ' + manager.name };
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
  @Patch('price')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
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
  @Delete('price/many')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new UpdateWarehouseAbility())
  @HttpCode(201)
  async deleteManyPrice(
    @Request() req: any,
    @Body() data: DeleteManyDto,
  ): Promise<{ status: string }> {
    try {
      for (const id of data.ids) {
        const salePrice =
          await this.warehouseValidateRules.deleteManyPriceValidate(id);
        await this.deleteSalePriceUseCase.execute(salePrice);
      }
      return { status: 'SUCCESS' };
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
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ReadWarehouseAbility())
  @HttpCode(201)
  async getPriceTable(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query() params: PaginationDto,
  ): Promise<SalePriceResponseDto[]> {
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
