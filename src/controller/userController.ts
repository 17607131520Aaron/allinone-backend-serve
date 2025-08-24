import { Controller, Get, Post, Inject } from '@nestjs/common';
import type { IUserInfoService } from '@/services/interfaces/userinfo.interface';

@Controller('userinfo')
export class UserController {
  constructor(@Inject('IUserInfoService') private readonly userinfoService: IUserInfoService) {}

  @Get('getUserInfo')
  public getUserInfo(): { username: string; password: string } {
    // 返回原始对象，由全局 DTO 映射拦截器处理
    return this.userinfoService.getUserInfo();
  }

  @Post('registerUser')
  public registerUser(): string {
    return this.userinfoService.registerUser();
  }
}
