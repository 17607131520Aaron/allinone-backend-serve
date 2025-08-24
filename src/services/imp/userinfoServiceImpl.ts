import { Injectable } from '@nestjs/common';
import { IUserInfoService } from '@/services/interfaces/userinfo.interface';

@Injectable()
export class UserInfoServiceImpl implements IUserInfoService {
  public getUserInfo(): { username: string; password: string } {
    return {
      username: 'admin',
      password: '123456',
    };
  }

  public registerUser(): string {
    return '注册成功';
  }
}
