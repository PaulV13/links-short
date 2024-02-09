import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { User } from 'src/users/entity/user.entity'
import { TokenAccess } from 'types'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() { email, password }: AuthDto): Promise<TokenAccess> {
    return this.authService.login(email, password)
  }

  @Post('register')
  async register(@Body() { email, password }: AuthDto): Promise<User> {
    return await this.authService.register(email, password)
  }
}
