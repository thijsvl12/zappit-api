import { User } from '@decorators/user.decorator';
import { CreateUserDto } from '@modules/user/dto/create-user.input';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(TokenInterceptor)
  public async login(@User() user) {
    return user;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(TokenInterceptor)
  public refresh(@User() user) {
    return user;
  }
}
