import { JwtRefreshAuthGuard } from '@guards/jwt-refresh-auth.guard';
import { CreateUserDto } from '@modules/user/dto/create-user.input';
import { LoginUserDto } from '@modules/user/dto/login-user.input';
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { TokenInterceptor } from './interceptors/token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @UseInterceptors(TokenInterceptor)
  public async login(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.authService.login(loginUserDto);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  public refresh(@Req() req: Request) {
    return req.user;
  }
}
