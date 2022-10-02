import { CreateUserDto } from '@modules/user/dto/create-user.input';
import { LoginUserDto } from '@modules/user/dto/login-user.input';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService, RegistrationStatus } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const result = await this.authService.login(loginUserDto);

    res.cookie('zappit_at', result.access_token, {
      httpOnly: true,
      domain: process.env.EXTERNAL_DOMAIN,
    });

    res.cookie('zappit_rt', result.refresh_token, {
      httpOnly: true,
      domain: process.env.EXTERNAL_DOMAIN,
    });

    return result;
  }
}
