import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SetCookiesUseCase {
  execute(res: Response, accessToken: string, refreshToken?: string): void {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  }
}
