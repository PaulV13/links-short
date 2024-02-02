import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import { Response, Request } from 'express'
import { LinksService } from './links.service'
import { Link } from '@prisma/client'
import { UrlDto } from './dto/url.dto'
import axios from 'axios'

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
  async redirect(@Res() res: Response, @Param('code') code: string) {
    const link = await this.linksService.redirectToOriginalUrl(code)

    if (link) {
      await this.linksService.updateVisits(code)
      return res.redirect(link.url_original)
    }
  }

  @Get('info/ip')
  async infoIP(@Req() req: Request) {
    const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''

    return axios
      .get(`https://ipgeolocation.abstractapi.com/v1/?api_key=835c354aa85d4b6195173c62ccbe8eaf&ip_address=${ipAddress}`)
      .then(response => {
        return response.data
      })
      .catch(error => {
        return error
      })
  }
}
