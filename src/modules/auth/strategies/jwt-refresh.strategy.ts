import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { JwtPayload } from '../interfaces/jwt.interface';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from '@modules/token/token.service';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refresh_token = req.signedCookies?.['zappit_rt'];

          if (!refresh_token) {
            throw new HttpException('token_not_found', HttpStatus.UNAUTHORIZED);
          }

          return refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const token = await this.tokenService.findById(payload.jwtid);

    if (!token) {
      throw new HttpException('token_not_found', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findById(token.userId);

    if (!user) {
      throw new HttpException('invalid_token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
