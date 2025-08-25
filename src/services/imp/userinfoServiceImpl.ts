import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserInfoService } from '@/services/interfaces/userinfo.interface';
import { UserInfoResponseDto, UserInfoDto } from '@/dto/userinfo.dto';
import { User } from '@/entity/user.entity';

@Injectable()
export class UserInfoServiceImpl implements IUserInfoService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async getUserInfo(): Promise<UserInfoResponseDto> {
    try {
      // 从数据库获取用户信息
      const user = await this.userRepository.findOne({
        where: { username: 'admin' },
      });

      if (user) {
        return {
          username: user.username,
          password: user.password,
        };
      }

      // 如果数据库中没有用户，返回默认值
      return {
        username: 'admin',
        password: '123456',
      };
    } catch (error) {
      throw new BadRequestException('获取用户信息失败: ' + (error as Error).message);
    }
  }

  public async registerUser(): Promise<string> {
    try {
      // 检查用户是否已存在
      const existingUser = await this.userRepository.findOne({
        where: { username: 'admin' },
      });

      if (existingUser) {
        return '用户已存在';
      }

      // 创建新用户
      const newUser = this.userRepository.create({
        username: 'admin',
        password: '123456',
        email: 'admin@example.com',
        status: 1,
      });

      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      throw new BadRequestException('注册失败: ' + (error as Error).message);
    }
  }

  public async userLogin(userInfoDto: UserInfoDto): Promise<string> {
    try {
      // 从数据库验证用户登录
      const user = await this.userRepository.findOne({
        where: { username: userInfoDto.username, password: userInfoDto.password },
      });

      if (user) {
        return '登录成功';
      }

      return '用户名或密码错误';
    } catch (error) {
      throw new BadRequestException('登录失败: ' + (error as Error).message);
    }
  }
}
