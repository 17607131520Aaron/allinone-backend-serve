/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Post } from '@nestjs/common';
import { UserInfoService } from '@/services/userinfoServices';

@Controller('userinfo')
export class UserController {
  constructor(private readonly userinfoService: UserInfoService) {}
  @Get('getUserInfo')
  public getUserInfo(): any {
    return this.userinfoService.getUserInfo();
  }

  @Post('registerUser')
  public registerUser(): any {
    return this.userinfoService.registerUser();
  }
}
