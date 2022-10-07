import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { JWT_COOKIE_PREFIX } from '@constants/jwt.constant';
import { Observable } from 'rxjs';
import type { Response } from 'express';
import { TokenService } from '@modules/token/token.service';
import { User } from '@prisma/client';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<User> {
    return next.handle().pipe(
      mergeMap(async (user) => {
        const res = context.switchToHttp().getResponse<Response>();

        const token = await this.tokenService.generateRefreshToken(user);

        res.cookie(JWT_COOKIE_PREFIX + '_rt', token, {
          httpOnly: true,
          signed: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });

        return user;
      }),
    );
  }
}
