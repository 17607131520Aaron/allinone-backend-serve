import { IsNotEmpty, IsString } from 'class-validator';

//请求参数
export class UserInfoDto {
  @IsNotEmpty()
  @IsString()
  public username: string; //用户名

  @IsNotEmpty()
  @IsString()
  public password: string; //密码
}

//响应参数
export class UserInfoResponseDto {
  @IsNotEmpty()
  @IsString()
  public username: string; //用户名

  @IsNotEmpty()
  @IsString()
  public password: string; //密码
}