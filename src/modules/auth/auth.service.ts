import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDto } from '@modules/user/dto/create-user.input';
import { LoginUserDto } from '@modules/user/dto/login-user.input';
import { TokenService } from '@modules/token/token.service';
import { User } from '@prisma/client';
import { UserService } from '@modules/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const userInDb = await this.userService.findByUsername(userDto.username);

    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    const user = await this.userService.create(userDto);
    delete user.password;

    return user;
  }

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<User & { access_token: string; refresh_token: string }> {
    const user = await this.userService.findByUsername(loginUserDto.username);

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await compare(loginUserDto.password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      ...user,
    };
  }
}
