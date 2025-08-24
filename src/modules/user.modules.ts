import { Module } from '@nestjs/common';
import { UserController } from '@/controller/userController';
import { UserInfoServiceImpl } from '@/services/imp/userinfoServiceImpl';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserInfoService',
      useClass: UserInfoServiceImpl,
    },
  ],
  exports: ['IUserInfoService'],
})
export class UserModule {}
