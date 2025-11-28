import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@platform-user/auth/guards/jwt.guard';
import { AbilitiesGuard } from '@platform-user/permissions/user-permissions/guards/abilities.guard';
import { IS3Adapter } from '@libs/s3/adapter';
import {
  GetPresignedUrlDto,
  PutPresignedUrlDto,
} from './dto/receive/presigned-url.dto';
import { PresignedUrlResponseDto } from './dto/send/presigned-url-response.dto';

@Controller('s3')
@UseGuards(JwtGuard, AbilitiesGuard)
export class S3Controller {
  constructor(private readonly s3Service: IS3Adapter) {}

  @Get('presigned-url')
  @HttpCode(HttpStatus.OK)
  async getPresignedUrl(
    @Query() query: GetPresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    const { key, expiresIn = 3600 } = query;

    const url = await this.s3Service.getPresignedUrl(key, expiresIn);

    return new PresignedUrlResponseDto(url, key, expiresIn);
  }

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  async putPresignedUrl(
    @Body() body: PutPresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    const { key, expiresIn = 3600 } = body;

    const url = await this.s3Service.putPresignedUrl(key, expiresIn);

    return new PresignedUrlResponseDto(url, key, expiresIn);
  }
}
