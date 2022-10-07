import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PaswordlessUser } from '@modules/user/interfaces/user.interface';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<PaswordlessUser> {
    return await this.authService.login({ username, password });
  }
}
