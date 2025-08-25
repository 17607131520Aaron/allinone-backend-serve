import { Injectable, BadRequestException } from '@nestjs/common';
import { IUserInfoService } from '@/services/interfaces/userinfo.interface';
import { UserInfoResponseDto } from '@/dto/userinfo.dto';

@Injectable()
export class UserInfoServiceImpl implements IUserInfoService {
  public getUserInfo(): UserInfoResponseDto {
    const flag = true; //模型接口
    if (flag) {
      return {
        username: 'admin',
        password: '123456',
      };
    }
    throw new BadRequestException('获取用户信息失败');
  }

  public registerUser(): string {
    return '注册成功';
  }

  public userLogin(): string {
    return '登录成功';
  }
}
