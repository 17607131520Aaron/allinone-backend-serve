import { Expose } from 'class-transformer';

// //响应参数
// export class UserInfoDto {
//   @IsNotEmpty()
//   @IsString()
//   public username: string; //用户名

//   @IsNotEmpty()
//   @IsString()
//   public password: string; //密码
// }

export class UserInfoResponseDto {
  @Expose()
  public username: string;

  @Expose()
  public password: string;
}
