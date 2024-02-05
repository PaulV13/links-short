import { Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { plainToClass, plainToInstance } from 'class-transformer'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany()

    return plainToInstance(UserDto, users)
  }

  async findOne(email: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return plainToClass(UserDto, user)
  }
}
