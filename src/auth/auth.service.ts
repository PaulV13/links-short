import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserDto } from 'src/users/dto/user.dto'
import { plainToClass } from 'class-transformer'
import { TokenDto } from './dto/token.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<TokenDto> {
    const user = await this.prisma.user.findUnique({ where: { email: email } })

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`)
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }

    const payload = { sub: user.id, email: user.email }
    return {
      accessToken: await this.jwtService.signAsync(payload),
    }
  }

  async register(email: string, password: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { email: email } })

    if (user) {
      throw new NotFoundException(`User exists for email: ${email}`)
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        password: hash,
      },
    })

    return plainToClass(UserDto, newUser)
  }
}
