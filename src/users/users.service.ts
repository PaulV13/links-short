import { Injectable, NotFoundException } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { plainToInstance } from 'class-transformer'
import { User } from './entity/user.entity'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany()

    return plainToInstance(User, users)
  }

  async findOne(email: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) throw new NotFoundException(`No existe el usuario con este email: ${email}`)

    return plainToInstance(User, user)
  }
}
