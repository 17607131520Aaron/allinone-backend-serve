import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class LoginDto {
  public username: string;
  public password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录并签发JWT' })
  public async login(@Body() body: LoginDto): Promise<{ token: string }> {
    const { username, password } = body;
    return await this.authService.validateUserAndSignToken(username, password);
  }
}
