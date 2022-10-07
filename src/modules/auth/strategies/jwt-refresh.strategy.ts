import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JWT_COOKIE_PREFIX } from '@constants/jwt.constant';
import { JwtPayload } from '../interfaces/jwt.interface';
import { PassportStrategy } from '@nestjs/passport';
import { PaswordlessUser } from '@modules/user/interfaces/user.interface';
import { Request } from 'express';
import { TokenService } from '@modules/token/token.service';
import { UserService } from '@modules/user/user.service';
import { exclude } from '@utils/object.util';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refresh_token = req.signedCookies?.[JWT_COOKIE_PREFIX + '_rt'];

          if (!refresh_token) {
            throw new HttpException('token_not_found', HttpStatus.UNAUTHORIZED);
          }

          return refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('APP_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<PaswordlessUser> {
    const token = await this.tokenService.findById(payload.jwtid);

    if (!token) {
      throw new HttpException('token_not_found', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findById(token.userId);

    if (!user) {
      throw new HttpException('invalid_token', HttpStatus.UNAUTHORIZED);
    }

    return exclude(user, 'password');
  }
}
