import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':email')
  async findOne(@Param('email') email: string) {
    return await this.usersService.findOne(email)
  }

  @Get('/')
  async getAll() {
    return await this.usersService.getAll()
  }
}
