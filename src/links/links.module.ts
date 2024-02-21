import { Module } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinksController } from './links.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
