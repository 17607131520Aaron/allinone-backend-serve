import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/entity/user.entity';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUserAndSignToken(
    username: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { username, status: 1 } });
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isHashMatch = await bcrypt.compare(password, user.password);
    if (!isHashMatch) {
      if (user.password === password) {
        const newHash = await bcrypt.hash(password, 10);
        user.password = newHash;
        await this.userRepository.save(user);
      } else {
        throw new UnauthorizedException('用户名或密码错误');
      }
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
