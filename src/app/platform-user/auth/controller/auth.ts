import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { LocalGuard } from '@platform-user/auth/guards/local.guard';
import { AuthLoginDto } from '@platform-user/auth/controller/dto/auth-login.dto';
import { LoginAuthUseCase } from '@platform-user/auth/use-cases/auth-login';
import { AuthRegisterDto } from '@platform-user/auth/controller/dto/auth-register.dto';
import { RegisterAuthUseCase } from '@platform-user/auth/use-cases/auth-register';
import { RefreshGuard } from '@platform-user/auth/guards/refresh.guard';

@Controller('auth')
export class Auth {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly authLogin: LoginAuthUseCase,
    private readonly authRegister: RegisterAuthUseCase,
  ) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  @HttpCode(201)
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
      return await this.authLogin.execute(body.email, user.props.id);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() body: AuthRegisterDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { correctUser, accessToken, refreshToken } =
        await this.authRegister.execute(body);
      return {
        user: correctUser,
        tokens: {
          accessToken: accessToken.token,
          accessTokenExp: accessToken.expirationDate,
          refreshToken: refreshToken.token,
          refreshTokenExp: refreshToken.expirationDate,
        },
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  @HttpCode(200)
  async refresh(@Body() body: any, @Req() req: any): Promise<any> {
    try {
      const { user } = req;
      const accessToken = await this.singAccessToken.execute(
        user.props.email,
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