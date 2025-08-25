import { Controller, Get, Post, Inject, Body } from '@nestjs/common';
import type { IUserInfoService } from '@/services/interfaces/userinfo.interface';
import { UserInfoResponseDto, UserInfoDto } from '@/dto/userinfo.dto';

@Controller('userinfo')
export class UserController {
  constructor(@Inject('IUserInfoService') private readonly userinfoService: IUserInfoService) {}
  @Get('getUserInfo')
  public getUserInfo(): UserInfoResponseDto {
    // 返回原始对象，由全局 DTO 映射拦截器处理
    return this.userinfoService.getUserInfo();
  }

  //用户登录接口
  @Post('userLogin')
  public async userLogin(@Body() userInfoDto: UserInfoDto) {
    return '登录成功';
  }

  @Post('registerUser')
  public registerUser(): string {
    return this.userinfoService.registerUser();
  }
}
