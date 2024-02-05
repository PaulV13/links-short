import { Module } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinksController } from './links.controller'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
