import { Injectable, BadRequestException } from '@nestjs/common';
import { IUserInfoService } from '@/services/interfaces/userinfo.interface';

@Injectable()
export class UserInfoServiceImpl implements IUserInfoService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getUserInfo(): any {
    // Example: throw an exception to test global error handling
    throw new BadRequestException('获取用户信息失败');
  }

  public registerUser(): string {
    return '注册成功';
  }
}
