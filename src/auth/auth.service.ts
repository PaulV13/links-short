import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { plainToInstance } from 'class-transformer'
import { TokenAccess } from 'types'
import { User } from 'src/users/entity/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<TokenAccess> {
    const user = await this.prisma.user.findUnique({ where: { email: email } })

    if (!user) {
      throw new BadRequestException('Invalid email or password')
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid || !user) {
      throw new BadRequestException('Invalid email or password')
    }

    const payload = { sub: user.id, email: user.email }
    const accessToken = await this.jwtService.signAsync(payload)
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' })

    return { accessToken, refreshToken }
  }

  async register(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email: email } })

    if (user) {
      throw new BadRequestException(`User exists for email: ${email}`)
    }

    try {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          password: hash,
        },
      })
      return plainToInstance(User, newUser)
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.jwtService.verify(refreshToken)

    if (!payload) {
      throw new BadRequestException('Invalid refresh token')
    }

    const newPayload = { sub: payload.sub, email: payload.email }
    const accessToken = await this.jwtService.signAsync(newPayload)

    return { accessToken }
  }
}
