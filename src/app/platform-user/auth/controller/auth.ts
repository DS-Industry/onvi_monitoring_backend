import {
  Body,
  Controller, Get,
  HttpCode,
  Post,
  Req,
  Request,
  UseGuards
} from "@nestjs/common";
import { SignAccessTokenUseCase } from '@platform-user/auth/use-cases/auth-sign-access-token';
import { LocalGuard } from '@platform-user/auth/guards/local.guard';
import { AuthLoginDto } from '@platform-user/auth/controller/dto/auth-login.dto';
import { LoginAuthUseCase } from '@platform-user/auth/use-cases/auth-login';
import { AuthRegisterDto } from '@platform-user/auth/controller/dto/auth-register.dto';
import { RegisterAuthUseCase } from '@platform-user/auth/use-cases/auth-register';
import { RefreshGuard } from '@platform-user/auth/guards/refresh.guard';
import { EmailGuard } from '@platform-user/auth/guards/email.guard';
import { AuthActivationDto } from '@platform-user/auth/controller/dto/auth-activation.dto';
import { AuthPasswordConfirmDto } from '@platform-user/auth/controller/dto/auth-password-confirm.dto';
import { AuthPasswordResetDto } from '@platform-user/auth/controller/dto/auth-password-reset.dto';
import { PasswordConfirmMailUserUseCase } from '@platform-user/auth/use-cases/auth-password-confirm';
import { PasswordResetUserUseCase } from '@platform-user/auth/use-cases/auth-password-reset';
import { ActivateAuthUseCase } from '@platform-user/auth/use-cases/auth-activate';
import { AuthRegisterWorkerDto } from '@platform-user/auth/controller/dto/auth-register-worker.dto';
import { AuthRegisterWorkerUseCase } from '@platform-user/auth/use-cases/auth-register-worker';

@Controller('auth')
export class Auth {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly authLogin: LoginAuthUseCase,
    private readonly authRegister: RegisterAuthUseCase,
    private readonly authActive: ActivateAuthUseCase,
    private readonly passwordConfirmMail: PasswordConfirmMailUserUseCase,
    private readonly passwordReset: PasswordResetUserUseCase,
    private readonly authRegisterWorker: AuthRegisterWorkerUseCase,
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
  async register(@Body() body: AuthRegisterDto): Promise<any> {
    try {
      const { correctUser, sendMail } = await this.authRegister.execute(body);
      return {
        user: correctUser,
        statusMail: sendMail,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  @Post('/worker')
  @HttpCode(201)
  async registerWorker(@Body() body: AuthRegisterWorkerDto): Promise<any> {
    try {
      const { correctUser, sendMail } =
        await this.authRegisterWorker.execute(body);
      return {
        user: correctUser,
        statusMail: sendMail,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  @UseGuards(EmailGuard)
  @Post('/activation')
  @HttpCode(201)
  async activation(
    @Body() body: AuthActivationDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      if (user.register) {
        return {
          user: null,
          tokens: null,
          type: 'register-required',
        };
      }
      return await this.authActive.execute(user);
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

  @UseGuards(EmailGuard)
  @Post('/password/reset')
  @HttpCode(201)
  async reset(
    @Body() body: AuthPasswordResetDto,
    @Request() req: any,
  ): Promise<any> {
    try {
      const { user } = req;
      if (user.register) {
        return {
          admin: null,
          tokens: null,
          type: 'register-required',
        };
      }
      return await this.passwordReset.execute(
        user,
        body.newPassword,
        body.checkNewPassword,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  @Post('/password/confirm')
  @HttpCode(201)
  async passwordConfirm(@Body() body: AuthPasswordConfirmDto): Promise<any> {
    try {
      return await this.passwordConfirmMail.execute(body.email);
    } catch (e) {
      throw new Error(e);
    }
  }
}
