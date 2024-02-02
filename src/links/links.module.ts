import { Module } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinksController } from './links.controller'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [LinksController],
  providers: [LinksService, PrismaService],
})
export class LinksModule {}
