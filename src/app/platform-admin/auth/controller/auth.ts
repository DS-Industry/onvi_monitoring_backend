import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { AuthLoginDto } from '@platform-admin/auth/controller/dto/auth-login.dto';
import { LoginAuthUseCase } from '@platform-admin/auth/use-cases/auth-login';
import { LocalGuard } from '@platform-admin/auth/guards/local.guard';
import { RefreshGuard } from '@platform-admin/auth/guards/refresh.guard';
import { SignAccessTokenUseCase } from '@platform-admin/auth/use-cases/auth-sign-access-token';

@Controller('auth')
export class Auth {
  constructor(
    private readonly authLogin: LoginAuthUseCase,
    private readonly singAccessToken: SignAccessTokenUseCase,
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

  @Post('/verify')
  @HttpCode(201)
  async verify(@Body() body: any): Promise<any> {
    try {
      return 201;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/password/reset')
  @HttpCode(201)
  async reset(@Body() body: any): Promise<any> {
    try {
      return 201;
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
