import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '@modules/token/token.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    return true;
  }
}
