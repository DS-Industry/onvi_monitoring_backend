import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FindMethodsPlacementUseCase } from '@business-core/placement/use-case/placement-find-methods';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { CustomHttpException } from '@exception/custom-http.exception';
import { PlacementResponseDto } from '@platform-user/core-controller/dto/response/placement-response.dto';

@Controller('placement')
export class PlacementController {
  constructor(
    private readonly findMethodsPlacementUseCase: FindMethodsPlacementUseCase,
  ) {}
  //findAll
  @Get('')
  @UseGuards(JwtGuard)
  @HttpCode(200)
  async getAll(): Promise<PlacementResponseDto[]> {
    try {
      const placements = await this.findMethodsPlacementUseCase.getAll();
      return placements.map((placement) => ({
        id: placement.id,
        country: placement.country,
        region: placement.region,
        city: placement.city,
        utc: placement.utc,
      }));
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
