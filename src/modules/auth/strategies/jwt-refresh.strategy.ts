import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refresh_token = req.cookies?.['zappit_rt'];

          if (!refresh_token) {
            throw new HttpException('token_not_found', HttpStatus.UNAUTHORIZED);
          }

          return refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<any> {
    const refresh_token = req.cookies?.['zappit_rt'];

    return refresh_token;
  }
}
