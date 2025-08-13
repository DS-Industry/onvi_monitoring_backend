import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto } from '@platform-admin/auth/controller/dto/auth-login.dto';
import { LoginAuthUseCase } from '@platform-admin/auth/use-cases/auth-login';
import { LocalGuard } from '@platform-admin/auth/guards/local.guard';
import { RefreshGuard } from '@platform-admin/auth/guards/refresh.guard';
import { SignAccessTokenUseCase } from '@platform-admin/auth/use-cases/auth-sign-access-token';
import { SetCookiesUseCase } from '@platform-admin/auth/use-cases/auth-set-cookies';
import { LogoutUseCase } from '@platform-admin/auth/use-cases/auth-logout';
import { EmailGuard } from '@platform-admin/auth/guards/email.guard';
import { AuthActivationDto } from '@platform-admin/auth/controller/dto/auth-activation.dto';
import { ActivateAuthUseCase } from '@platform-admin/auth/use-cases/auth-activate';
import { AuthPasswordConfirmDto } from '@platform-admin/auth/controller/dto/auth-password-confirm.dto';
import { PasswordConfirmMailAdminUseCase } from '@platform-admin/auth/use-cases/auth-password-confirm';
import { AuthPasswordResetDto } from '@platform-admin/auth/controller/dto/auth-password-reset.dto';
import { PasswordResetAdminUseCase } from '@platform-admin/auth/use-cases/auth-password-reset';
import { AbilityFactory } from '@platform-admin/permissions/ability.factory';
import { Admin } from '@platform-admin/admin/domain/admin';
import { PermissionAction } from '@prisma/client';
import { CheckAbilities } from '@common/decorators/abilities.decorator';
import { AbilitiesGuard } from '@platform-admin/admin-permissions/guards/abilities.guard';
import { JwtGuard } from '@platform-admin/auth/guards/jwt.guard';

@Controller('auth')
export class Auth {
  constructor(
    private readonly authLogin: LoginAuthUseCase,
    private readonly authActive: ActivateAuthUseCase,
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly passwordConfirmMail: PasswordConfirmMailAdminUseCase,
    private readonly passwordReset: PasswordResetAdminUseCase,
    private readonly setCookies: SetCookiesUseCase,
    private readonly logout: LogoutUseCase,
    private abilityFacrory: AbilityFactory,
  ) {}
  @UseGuards(LocalGuard)
  @Post('/login')
  @HttpCode(201)
  async login(
    @Body() body: AuthLoginDto,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
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
      const ability = await this.abilityFacrory.createForPlatformManager(user);
      console.log(ability);
      const check = ability.can(PermissionAction.update, Admin);
      console.log(check);
      const response = await this.authLogin.execute(body.email, user.props.id);

      this.setCookies.execute(
        res,
        response.tokens.accessToken,
        response.tokens.refreshToken,
      );

      const { tokens, ...responseWithoutTokens } = response;
      return responseWithoutTokens;
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
          admin: null,
          tokens: null,
          type: 'register-required',
        };
      }
      return await this.authActive.execute(user);
    } catch (e) {
      throw new Error(e);
    }
  }

  @UseGuards(EmailGuard, AbilitiesGuard)
  @CheckAbilities({ action: PermissionAction.update, subject: 'Admin' })
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

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const { user } = req;
      const accessToken = await this.singAccessToken.execute(
        user.props.email,
        user.props.id,
      );

      this.setCookies.execute(res, accessToken.token);

      return {
        success: true,
        accessTokenExp: accessToken.expirationDate,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  @UseGuards(JwtGuard)
  @Get('/validate')
  @HttpCode(200)
  async validate(@Request() req: any): Promise<any> {
    try {
      const { user } = req;
      return {
        valid: true,
        user: {
          id: user.props.id,
          email: user.props.email,
        },
      };
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  @Post('/logout')
  @HttpCode(200)
  async logoutAdmin(@Res({ passthrough: true }) res: Response): Promise<any> {
    try {
      this.logout.execute(res);
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (e) {
      throw new Error('Logout failed');
    }
  }
}
