import { JwtRefreshAuthGuard } from '@guards/jwt-refresh-auth.guard';
import { DataResponse } from '@interfaces/response';
import { CreateUserDto } from '@modules/user/dto/create-user.input';
import { LoginUserDto } from '@modules/user/dto/login-user.input';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<DataResponse<User>> {
    return { data: await this.authService.register(createUserDto) };
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DataResponse<User & { access_token: string }>> {
    const { refresh_token, ...result } = await this.authService.login(
      loginUserDto,
    );

    res.cookie('zappit_rt', refresh_token, {
      httpOnly: true,
      domain: process.env.EXTERNAL_DOMAIN,
    });

    return { data: result };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  public refresh(@Req() req: Request) {
    return req.user;
  }
}
