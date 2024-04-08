import { Injectable } from '@nestjs/common';
import { PlatformAdminRepository } from '../infrastructure/platformAdmin.repository';
import { PlatformAdmin } from '../domain/PlatformAdmin';
import { CreatRequestPlatformAdminDtpDto } from '../infrastructure/http/dto/creat-request-platformAdmin.dto';
import { IBcrypt } from '../../../common/interfaces/bcrypt.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from '../../../common/interfaces/jwt.interface';
import { ConfigService } from '@nestjs/config';
import ms = require('ms');

@Injectable()
export class PlatformAdminUseCase {
  constructor(
    private readonly platformRepository: PlatformAdminRepository,
    private readonly bcryptService: IBcrypt,
    private readonly configService: ConfigService,
    private readonly jwtService: IJwtService,
  ) {}

  async create(data: CreatRequestPlatformAdminDtpDto) {
    const checkEmail = await this.platformRepository.findOneByEmail(data.email);
    if (checkEmail) {
      throw new Error('email exists');
    }
    if (data.password != data.checkPassword) {
      throw new Error("passwords don't match");
    }
    const accessToken = await this.signAccessToken(data.phone);
    const refreshToken = await this.signRefreshToken(data.phone);
    const hashPassword = await this.bcryptService.hash(data.password);
    const platformAdminData = {
      ...data,
      password: hashPassword,
      refreshTokenId: refreshToken.token,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };
    const platformAdmin = PlatformAdmin.create(platformAdminData);
    const platformAdminDb = await this.platformRepository.create({
      data: platformAdmin,
    });
    return { platformAdminDb, accessToken, refreshToken };
  }

  async findOnId(data: any) {
    return this.platformRepository.findOneById(data);
  }

  async findAll() {
    return this.platformRepository.findAll();
  }

  public async validateUserForJwtStrategy(
    phone: string,
  ): Promise<PlatformAdmin> {
    const platformAdmin = await this.platformRepository.findOneByPhone(phone);
    if (!platformAdmin) {
      throw new Error('phone not exists');
    }
    return platformAdmin;
  }

  public async getAccountIfRefreshTokenMatches(
    refreshToken: string,
    phone: string,
  ) {
    const platformAdmin = await this.platformRepository.findOneByPhone(phone);
    if (!platformAdmin) {
      throw new Error('phone not exists');
    }

    const isRefreshingTokenMatching = await this.bcryptService.compare(
      refreshToken,
      platformAdmin.refreshTokenId,
    );

    if (isRefreshingTokenMatching) {
      return platformAdmin;
    }
  }

  public async validateUserForLocalStrategy(
    email: string,
    password: string,
  ): Promise<PlatformAdmin> {
    const platformAdmin = await this.platformRepository.findOneByEmail(email);

    if (!platformAdmin) {
      return null;
    }

    const checkPassword = await this.bcryptService.compare(
      password,
      platformAdmin.password,
    );

    if (!checkPassword) {
      throw new Error('password error');
    }

    return platformAdmin;
  }

  public async signAccessToken(phone: any) {
    const payload: IJwtServicePayload = { phone: phone };
    const secret = this.configService.get<string>('jwtSecret');
    const expiresIn = this.configService.get<string>('jwtExpirationTime');
    const token = this.jwtService.signToken(payload, secret, expiresIn);
    const expirationDate = new Date(
      new Date().getTime() + Math.floor(ms(expiresIn) / 1000) * 1000,
    ).toISOString();
    return { token, expirationDate };
  }

  public async signRefreshToken(phone: any) {
    const payload: IJwtServicePayload = { phone: phone };
    const secret = this.configService.get<string>('jwtRefreshTokenSecret');
    const expiresIn = this.configService.get<string>(
      'jwtRefreshTokenExpiration',
    );
    const token = this.jwtService.signToken(payload, secret, expiresIn);
    const expirationDate = new Date(
      new Date().getTime() + Math.floor(ms(expiresIn) / 1000) * 1000,
    ).toISOString();

    return { token, expirationDate };
  }
}
