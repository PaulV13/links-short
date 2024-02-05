import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { UserDto } from 'src/users/dto/user.dto'
import { TokenDto } from './dto/token.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() { email, password }: AuthDto): Promise<TokenDto> {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() { email, password }: AuthDto): Promise<UserDto> {
    return await this.authService.register(email, password)
  }
}
