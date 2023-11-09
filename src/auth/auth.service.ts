import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './dto/auth.dto';
import { Payload } from './security/payload';
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(newUser: UserDTO): Promise<void> {
    const userFind: UserDTO = await this.userService.findOne({
      where: { nickname: newUser.nickname },
    });
    if (userFind)
      throw new HttpException(
        '해당 닉네임은 이미 사용중입니다.',
        HttpStatus.BAD_REQUEST,
      );
    await this.userService.save(newUser);
  }

  async validateUser(
    authDTO: AuthDTO,
  ): Promise<{ accessToken: string } | undefined> {
    const userFind: User = await this.userService.findOne({
      where: { nickname: authDTO.nickname },
    });
    const validatePassword = await bcrypt.compare(
      authDTO.password,
      userFind.password,
    );
    if (!userFind || !validatePassword) {
      throw new UnauthorizedException();
    }
    const payload: Payload = {
      userId: userFind.id,
      nickname: userFind.nickname,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async tokenValidateUser(payload: Payload): Promise<User | undefined> {
    return await this.userService.findOne({
      where: { id: payload.userId },
    });
  }
}
