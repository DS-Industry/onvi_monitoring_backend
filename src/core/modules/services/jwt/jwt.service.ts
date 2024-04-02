import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { IJwtService, IJwtServicePayload } from "../../../common/interfaces/jwt.interface";

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  signToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  async validateToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
