import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { AuthDTO } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
    await this.authService.registerUser(userDTO);
    return {
      message: '회원가입 되었습니다.',
    };
  }

  @Post('/login')
  async login(@Body() authDTO: AuthDTO): Promise<{ accessToken: string }> {
    return await this.authService.validateUser(authDTO);
  }
}
