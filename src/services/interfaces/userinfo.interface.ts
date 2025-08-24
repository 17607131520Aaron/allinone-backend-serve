export interface IUserInfoService {
  getUserInfo(): { username: string; password: string };
  registerUser(): string;
}
