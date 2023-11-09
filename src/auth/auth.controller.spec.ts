import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { AuthDTO } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    registerUser: jest.fn(),
    validateUser: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('회원가입', async () => {
    const mockUserDTO: UserDTO = {
      nickname: '고양이톰이',
      password: 'asdf1234',
    };
    const response = { message: '회원가입 성공' };
    jest.spyOn(authService, 'registerUser').mockResolvedValue(response);

    const result = await controller.registerAccount(mockUserDTO);

    expect(result).toEqual(response);
  });

  it('로그인', async () => {
    const authDTO: AuthDTO = {
      nickname: '고양이톰이',
      password: 'asdf1234',
    };
    const accessToken = '엑세스 토큰';

    jest.spyOn(authService, 'validateUser').mockResolvedValue({ accessToken });

    const result = await controller.login(authDTO);

    expect(result).toEqual({ accessToken });
  });
});
