import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { RedisService } from '@infra/cache/redis.service';
import { FindMethodsPlacementUseCase } from '@business-core/placement/use-case/placement-find-methods';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { CustomHttpException } from '@exception/custom-http.exception';
import { PlacementResponseDto } from '@platform-user/core-controller/dto/response/placement-response.dto';

@Controller('placement')
export class PlacementController {
  constructor(
    private readonly findMethodsPlacementUseCase: FindMethodsPlacementUseCase,
    private readonly redisService: RedisService,
  ) {}
  //findAll
  @Get('')
  // @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAll(): Promise<PlacementResponseDto[]> {
    try {
      const cacheKey = 'placements:all';
      const cachedPlacements = await this.redisService.get(cacheKey);

      if (cachedPlacements) {
        console.log('cached');
        return JSON.parse(cachedPlacements);
      }

      console.log('No');

      const placements = await this.findMethodsPlacementUseCase.getAll();
      const result = placements.map((placement) => ({
        id: placement.id,
        country: placement.country,
        region: placement.region,
        utc: placement.utc,
      }));

      await this.redisService.set(cacheKey, JSON.stringify(result), 3600);
      return result;
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
