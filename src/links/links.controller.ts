import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import { Response, Request } from 'express'
import { LinksService } from './links.service'
import { Link } from '@prisma/client'
import { UrlDto } from './dto/url.dto'

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('links?')
  async createUrlShort(@Body() body: UrlDto, @Query('param') param: string): Promise<Link> {
    return await this.linksService.createUrlShort(body, param)
  }

  @Get()
  async findAllLinks(): Promise<Link[]> {
    return await this.linksService.findAll()
  }

  @Get(':code')
  async redirect(@Res() res: Response, @Req() req: Request, @Param('code') code: string) {
    const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''
    const link = await this.linksService.redirectToOriginalUrl(code)

    if (link) {
      await this.linksService.updateVisits(link, ipAddress)
      return res.redirect(link.url_original)
    }
  }

  @Get(':code/allCountry')
  async getAllCountry(@Param('code') code: string) {
    return await this.linksService.getAllCountry(code)
  }
}
