import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LocalGuard } from '@mobile-user/auth/guards/local.guard';
import { AuthLoginDto } from '@mobile-user/auth/controller/dto/auth-login.dto';
import { LoginAuthUseCase } from '@mobile-user/auth/use-cases/auth-login';
import { SignAccessTokenUseCase } from '@mobile-user/auth/use-cases/auth-sign-access-token';
import { AuthSendOtpDto } from '@mobile-user/auth/controller/dto/auth-send-otp.dto';
import { SendOtpAuthUseCase } from '@mobile-user/auth/use-cases/auth-send-otp';
import { RefreshGuard } from '@mobile-user/auth/guards/refresh.guard';
import { AuthRegisterDto } from '@mobile-user/auth/controller/dto/auth-register.dto';
import { RegisterAuthUseCase } from '@mobile-user/auth/use-cases/auth-register';

@Controller('auth')
export class Auth {
  constructor(
    private readonly authLogin: LoginAuthUseCase,
    private readonly authSendOtp: SendOtpAuthUseCase,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly authRegister: RegisterAuthUseCase,
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
      return await this.authLogin.execute(body.phone, user.props.id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: AuthRegisterDto, @Request() req: any) {
    const { correctClient, accessToken, refreshToken } =
      await this.authRegister.execute(body.phone, body.otp);
    return {
      client: correctClient,
      tokens: {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
        refreshToken: refreshToken.token,
        refreshTokenExp: refreshToken.expirationDate,
      },
    };
  }

  @HttpCode(201)
  @Post('/send/otp')
  async sendOtp(@Body() body: AuthSendOtpDto) {
    try {
      const phone = body.phone;
      const otp = await this.authSendOtp.execute(phone);
      return {
        status: 'SUCCESS',
        target: otp.phone,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  @HttpCode(200)
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Body() body: any, @Request() req: any) {
    try {
      const { user } = req;
      const accessToken = await this.singAccessToken.execute(
        user.props.phone,
        user.props.id,
      );
      return {
        accessToken: accessToken.token,
        accessTokenExp: accessToken.expirationDate,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
