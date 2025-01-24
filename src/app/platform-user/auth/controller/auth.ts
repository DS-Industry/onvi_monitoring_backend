import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
import { EmailGuard } from '@platform-user/auth/guards/email.guard';
import { AuthActivationDto } from '@platform-user/auth/controller/dto/auth-activation.dto';
import { AuthPasswordConfirmDto } from '@platform-user/auth/controller/dto/auth-password-confirm.dto';
import { AuthPasswordResetDto } from '@platform-user/auth/controller/dto/auth-password-reset.dto';
import { PasswordResetUserUseCase } from '@platform-user/auth/use-cases/auth-password-reset';
import { ActivateAuthUseCase } from '@platform-user/auth/use-cases/auth-activate';
import { AuthRegisterWorkerDto } from '@platform-user/auth/controller/dto/auth-register-worker.dto';
import { AuthRegisterWorkerUseCase } from '@platform-user/auth/use-cases/auth-register-worker';
import { AuthValidateRules } from '@platform-user/validate/validate-rules/auth-validate-rules';
import { SendConfirmMailUseCase } from '@platform-user/confirmMail/use-case/confirm-mail-send';
import { GetAllPermissionsInfoUseCases } from '@platform-user/permissions/use-cases/get-all-permissions-info';
import { CustomHttpException } from '@exception/custom-http.exception';
import { UserException } from '@exception/option.exceptions';

@Controller('auth')
export class Auth {
  constructor(
    private readonly singAccessToken: SignAccessTokenUseCase,
    private readonly authLogin: LoginAuthUseCase,
    private readonly authRegister: RegisterAuthUseCase,
    private readonly authActive: ActivateAuthUseCase,
    private readonly sendConfirm: SendConfirmMailUseCase,
    private readonly passwordReset: PasswordResetUserUseCase,
    private readonly authRegisterWorker: AuthRegisterWorkerUseCase,
    private readonly authValidateRules: AuthValidateRules,
    private readonly getAllPermissionsInfoUseCases: GetAllPermissionsInfoUseCases,
  ) {}
  //Login
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
      const response = await this.authLogin.execute(body.email, user.props.id);
      const permissionInfo =
        await this.getAllPermissionsInfoUseCases.getPermissionsInfoForUser(
          response.admin,
        );
      return { ...response, permissionInfo };
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //register
  @Post('/register')
  @HttpCode(201)
  async register(@Body() body: AuthRegisterDto): Promise<any> {
    try {
      await this.authValidateRules.registerValidate(body.email);
      const { correctUser, sendMail } = await this.authRegister.execute(body);
      return {
        user: correctUser,
        statusMail: sendMail,
      };
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Register worker in org on confirm string
  @Post('/worker')
  @HttpCode(201)
  async registerWorker(@Body() body: AuthRegisterWorkerDto): Promise<any> {
    try {
      const organizationIdConfirmMail =
        await this.authValidateRules.registerWorkerValidate(
          body.email,
          body.confirmString,
        );
      const { correctUser, sendMail } = await this.authRegisterWorker.execute(
        body,
        organizationIdConfirmMail,
      );
      return {
        user: correctUser,
        statusMail: sendMail,
      };
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Activation account
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
      const response = await this.authActive.execute(user);
      const permissionInfo =
        await this.getAllPermissionsInfoUseCases.getPermissionsInfoForUser(
          response.admin,
        );
      return { ...response, permissionInfo };
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Update refresh
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
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Reset password
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
      return await this.passwordReset.execute(user, body.newPassword);
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Send email for reset password
  @Post('/password/confirm')
  @HttpCode(201)
  async passwordConfirm(@Body() body: AuthPasswordConfirmDto): Promise<any> {
    try {
      await this.authValidateRules.passwordConfirmValidate(body.email);
      return await this.sendConfirm.execute(body.email, 'Смена пароля');
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
  //Valid confirm string
  @Post('/password/valid/confirm')
  @UseGuards(EmailGuard)
  @HttpCode(201)
  async passwordValidConfirm(@Body() body: AuthActivationDto): Promise<any> {
    try {
      return true;
    } catch (e) {
      if (e instanceof UserException) {
        throw new CustomHttpException({
          type: e.type,
          innerCode: e.innerCode,
          message: e.message,
          code: e.getHttpStatus(),
        });
      } else {
        throw new CustomHttpException({
          message: e.message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
