import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: Record<string, string>) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('login')
  login(@Body() body: Record<string, string>) {
    return this.authService.login(body.email, body.password);
  }
}
