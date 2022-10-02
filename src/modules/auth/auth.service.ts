import { CreateUserDto } from '@modules/user/dto/create-user.input';
import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '@modules/user/dto/login-user.input';
import { TokenService } from '@modules/token/token.service';
import { User } from '@prisma/client';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS',
    };

    try {
      status.data = await this.userService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userService.findByLogin(loginUserDto);

    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      data: user,
    };
  }
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
  data?: User;
}

export interface RegistrationSeederStatus {
  success: boolean;
  message: string;
  data?: User[];
}
