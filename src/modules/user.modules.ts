import { Module } from '@nestjs/common';
import { UserController } from '@/controller/userController';
import { UserInfoService } from '@/services/userinfoServices';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserInfoService],
  exports: [UserInfoService],
})
export class UserModule {}
