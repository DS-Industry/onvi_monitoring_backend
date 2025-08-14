import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LogoutUseCase {
  execute(res: Response): void {
    // Clear authentication cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
