import { Injectable } from '@nestjs/common';
@Injectable()
export class UserInfoService {
  getUserInfo() {
    return {
      username: 'admin',
      password: '123456',
    };
  }

  registerUser() {
    return '注册成功';
  }
}
