import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FindMethodsPlacementUseCase } from '@business-core/placement/use-case/placement-find-methods';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { CustomHttpException } from '@exception/custom-http.exception';
import { PlacementResponseDto } from '@platform-user/core-controller/dto/response/placement-response.dto';

@Controller('placement')
export class PlacementController {
  constructor(
    private readonly findMethodsPlacementUseCase: FindMethodsPlacementUseCase,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}
  //findAll
  @Get('')
  // @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAll(): Promise<PlacementResponseDto[]> {
    try {
      const cacheKey = 'placements:all';
      const cachedPlacements =
        await this.cache.get<PlacementResponseDto[]>(cacheKey);

      console.log('cachedPlacements', cachedPlacements);
      console.log('cache store type:', this.cache.stores);

      if (cachedPlacements) {
        return cachedPlacements;
      }

      const placements = await this.findMethodsPlacementUseCase.getAll();
      const result = placements.map((placement) => ({
        id: placement.id,
        country: placement.country,
        region: placement.region,
        utc: placement.utc,
      }));

      await this.cache.set(cacheKey, result, 3600000);
      return result;
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
