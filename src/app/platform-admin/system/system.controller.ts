import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-admin/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-admin/admin-permissions/guards/abilities.guard';
import {
  CheckAbilities,
  ManageOrgAbility,
} from '@common/decorators/abilities.decorator';
import { RedisService } from '@infra/cache/redis.service';
import { ConfigService } from '@nestjs/config';
import {
  CacheInvalidationRequest,
  CacheInvalidationResponse,
  SystemStatusResponse,
} from './dto/system.dto';

@Controller('system')
export class SystemController {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  @Post('cache/invalidate')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageOrgAbility())
  @HttpCode(200)
  async invalidateCache(
    @Body() request: CacheInvalidationRequest,
  ): Promise<CacheInvalidationResponse> {
    try {
      const { path } = request;
      let invalidatedPaths: string[] = [];

      if (path === '*' || path === 'all') {
        invalidatedPaths = await this.redisService.delByPattern('*');
      } else {
        invalidatedPaths = await this.redisService.delByPattern(`*${path}*`);
      }

      return {
        success: true,
        message: `Successfully invalidated ${invalidatedPaths.length} cache entries`,
        invalidatedPaths,
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to invalidate cache: ${error.message}`,
        invalidatedPaths: [],
      };
    }
  }

  @Get('status')
  @UseGuards(JwtGuard, AbilitiesGuard)
  @CheckAbilities(new ManageOrgAbility())
  @HttpCode(200)
  async getSystemStatus(): Promise<SystemStatusResponse> {
    try {
      // Check Redis connection
      const redisStatus = await this.redisService.exists('health-check');

      return {
        status: redisStatus ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        version: this.configService.get<string>('NODE_ENV') || 'development',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: this.configService.get<string>('NODE_ENV') || 'development',
      };
    }
  }
}
