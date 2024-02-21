import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { LinksModule } from './links/links.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [PrismaModule, LinksModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
