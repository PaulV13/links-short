import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { Response, Request } from 'express'
import { LinksService } from './links.service'
import { CreateLinkDto } from './dto/create-link.dto'
import { Link } from './entities/link.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { AuthRequest } from 'types'

@Controller('links')
@ApiTags('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/create-link-users-auth')
  async createUrlShortUserLogin(@Req() req: AuthRequest, @Body() body: CreateLinkDto, @Query('query') query: string): Promise<Link> {
    return await this.linksService.createUrlShort(req, body, query)
  }

  @Post('/create-link-all-users')
  async createUrlShortUsersNoLogin(@Body() body: CreateLinkDto): Promise<Link> {
    return await this.linksService.createUrlShortNoAuth(body)
  }

  @Get(':shortUrl')
  async redirect(@Res() res: Response, @Req() req: Request, @Param('shortUrl') shortUrl: string) {
    const link = await this.linksService.redirectToOriginalUrl(shortUrl, req)

    if (link) {
      return res.redirect(link.url_original)
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getLinksByUser(@Req() req: AuthRequest, @Param('userId') userId: string): Promise<Link[]> {
    return await this.linksService.getLinksByUser(req, userId)
  }
}
