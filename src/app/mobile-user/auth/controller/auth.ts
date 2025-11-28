import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { LocalGuard } from '@mobile-user/auth/guards/local.guard';
import { AuthLoginDto } from '@mobile-user/auth/controller/dto/auth-login.dto';
import { AuthSendOtpDto } from '@mobile-user/auth/controller/dto/auth-send-otp.dto';
import { RefreshGuard } from '@mobile-user/auth/guards/refresh.guard';
import { AuthRegisterDto } from '@mobile-user/auth/controller/dto/auth-register.dto';
import { InvalidOtpException } from '@mobile-user/shared/exceptions/auth.exceptions';
import { CustomHttpException } from '@exception/custom-http.exception';

import { AuthenticateClientUseCase } from '@mobile-core/auth/use-cases/authenticate-client';
import { RegisterClientUseCase } from '@mobile-core/auth/use-cases/register-client';
import { SendOtpUseCase } from '@mobile-core/auth/use-cases/send-otp';
import { RefreshTokensUseCase } from '@mobile-core/auth/use-cases/refresh-tokens';

@Controller('auth')
export class Auth {
  constructor(
    private readonly authenticateClient: AuthenticateClientUseCase,
    private readonly registerClient: RegisterClientUseCase,
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly refreshTokens: RefreshTokensUseCase,
  ) {}

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('/login')
  async login(@Body() body: AuthLoginDto, @Request() req: any): Promise<any> {
    try {
      const { user } = req;
      if (user.register) {
        return {
          client: null,
          tokens: null,
          type: 'register-required',
        };
      }
      return await this.authenticateClient.execute({
        client: user,
      });
    } catch (e) {
      if (e instanceof InvalidOtpException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: 401,
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: AuthRegisterDto) {
    try {
      return await this.registerClient.execute({
        phone: body.phone,
        otp: body.otp,
      });
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @HttpCode(201)
  @Post('/send/otp')
  async sendOtp(@Body() body: AuthSendOtpDto) {
    try {
      return await this.sendOtpUseCase.execute({
        phone: body.phone,
      });
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @HttpCode(200)
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Body() body: any, @Request() req: any) {
    try {
      const { user } = req;
      return await this.refreshTokens.execute({
        refreshToken: user.refreshToken,
      });
    } catch (e) {
      throw new CustomHttpException({
        message: e.message,
        code: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
