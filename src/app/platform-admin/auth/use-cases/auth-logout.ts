import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LogoutUseCase {
  execute(res: Response): void {
    // Clear authentication cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    // Clear CSRF token cookie
    res.clearCookie('_csrf', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}