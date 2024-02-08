import { Body, Controller, Get, Ip, Param, Post, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { LinksService } from './links.service'
import { Link } from '@prisma/client'
import { LinkDto } from './dto/url.dto'

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  async findAllLinks(): Promise<Link[]> {
    return await this.linksService.findAll()
  }

  @Post()
  async createUrlShort(@Body() body: LinkDto, @Query('param') param: string): Promise<Link> {
    return await this.linksService.createUrlShort(body, param)
  }

  @Get(':shortUrl')
  async redirect(@Res() res: Response, @Ip() ip: string, @Param('shortUrl') shortUrl: string) {
    const link = await this.linksService.redirectToOriginalUrl(shortUrl, ip)

    if (link) {
      return res.redirect(link.url_original)
    }
  }

  @Get(':id/visits')
  async getVisitsUrlshort(@Param('id') id: string): Promise<number> {
    return await this.linksService.getVisitsUrlshort(id)
  }

  @Get(':id/countries')
  async getCountriesUrlshort(@Param('id') id: string) {
    return await this.linksService.getCountriesUrlshort(id)
  }
}
