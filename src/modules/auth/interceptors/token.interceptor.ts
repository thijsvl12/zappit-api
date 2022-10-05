import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import type { Response } from 'express';
import { TokenService } from '@modules/token/token.service';
import { User } from '@prisma/client';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<User> {
    return next.handle().pipe(
      mergeMap(async (user) => {
        const res = context.switchToHttp().getResponse<Response>();

        const access_token = await this.tokenService.generateAccessToken(user);
        const refresh_token = await this.tokenService.generateRefreshToken(
          user,
        );

        res.setHeader('Authorization', `Bearer ${access_token}`);
        res.cookie('zappit_rt', refresh_token, {
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
