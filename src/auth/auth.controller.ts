import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { User } from 'src/users/entity/user.entity'
import { TokenAccess } from 'types'
import { ApiTags } from '@nestjs/swagger'
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard'
import { TokenRefreshDto } from './dto/auth.refresh.dto'

@Controller('auth')
@ApiTags('auth')
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

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Body() { refreshToken }: TokenRefreshDto): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(refreshToken)
  }
}
