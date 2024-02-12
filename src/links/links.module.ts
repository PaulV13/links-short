import { Module } from '@nestjs/common'
import { LinksService } from './links.service'
import { LinksController } from './links.controller'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma/prisma.module'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  controllers: [LinksController],
  providers: [LinksService, JwtService],
})
export class LinksModule {}
