import { UserInfoResponseDto } from '@/dto/userinfo.dto';
export interface IUserInfoService {
  getUserInfo(): { username: string; password: string };
  registerUser(): string;
  userLogin(UserInfoResponseDto: UserInfoResponseDto): string;
}
